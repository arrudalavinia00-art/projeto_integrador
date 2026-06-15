const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/*  NORMALIZAÇÃO */
const normalize = (v) =>
  (v || "")
    .toString()
    .trim()
    .replace(/\s/g, "")
    .toUpperCase();

/* DADOS */
let pecas = [
  {
    id: "PEC001",
    lote: "LT2025",
    dataFabricacao: "01/06/2025",
    local: "Fundição",
    horario: "08:30",
    status: "Em Produção",
    historico: [
      { local: "Recebimento", horario: "07:50" },
      { local: "Fundição", horario: "08:30" }
    ]
  },
  {
    id: "PEC002",
    lote: "LT2025",
    dataFabricacao: "01/06/2025",
    local: "Usinagem",
    horario: "09:10",
    status: "Em Transporte",
    historico: [
      { local: "Fundição", horario: "08:15" },
      { local: "Usinagem", horario: "09:10" }
    ]
  }
];

/* BUSCAR PEÇA */
app.get("/api/pecas/:id", (req, res) => {
  try {

    const idLimpo = normalize(req.params.id);

    const peca = pecas.find(p =>
      normalize(p.id) === idLimpo
    );

    if (!peca) {
      return res.status(404).json({ erro: "Peça não encontrada" });
    }

    return res.json(peca);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno" });
  }
});

/* ATUALIZAR PEÇA */
app.put("/api/pecas/:id", (req, res) => {
  try {

    const idLimpo = normalize(req.params.id);

    const peca = pecas.find(p =>
      normalize(p.id) === idLimpo
    );

    if (!peca) {
      return res.status(404).json({ erro: "Peça não encontrada" });
    }

    const novoLocal = (req.body.local || "").trim();

    if (!novoLocal) {
      return res.status(400).json({ erro: "O local é obrigatório" });
    }

    /* HORÁRIO SEM SEGUNDOS */
    const agora = new Date();
    const novoHorario =
      `${String(agora.getHours()).padStart(2, "0")}:` +
      `${String(agora.getMinutes()).padStart(2, "0")}`;

    /* ATUALIZA DADOS */
    peca.local = novoLocal;
    peca.horario = novoHorario;

    /* STATUS AUTOMÁTICO */
    const localLower = novoLocal.toLowerCase();

    if (localLower.includes("fund")) {
      peca.status = "Em Fundição";
    } else if (localLower.includes("usin")) {
      peca.status = "Em Usinagem";
    } else if (localLower.includes("estoq")) {
      peca.status = "Em Estoque";
    } else if (localLower.includes("trans")) {
      peca.status = "Em Transporte";
    } else {
      peca.status = "Em Processo";
    }

    /* HISTÓRICO */
    peca.historico.push({
      local: novoLocal,
      horario: novoHorario
    });

    return res.json({
      mensagem: "Peça atualizada com sucesso",
      dados: peca
    });

  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

/* SERVIDOR */
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000!");
});