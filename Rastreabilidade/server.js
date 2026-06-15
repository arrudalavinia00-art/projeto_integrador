const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* caminho do arquivo JSON (banco de dados) */
const DB_PATH = path.join(__dirname, "pecas.json");

/* ler peças do arquivo */
function lerPecas() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return []; // se der erro, retorna vazio
  }
}

/* salvar peças no arquivo */
function salvarPecas(dados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2));
}

/* limpar ID vindo do QR code */
function limparId(id) {
  return (id || "")
    .toString()
    .replace(/peca:|PEC:/gi, "")
    .trim()
    .toUpperCase();
}

/* buscar peça pelo ID */
app.get("/api/pecas/:id", (req, res) => {
  const pecas = lerPecas();

  const id = limparId(req.params.id);

  const peca = pecas.find(p => p.id.toUpperCase() === id);

  if (!peca) {
    return res.status(404).json({ erro: "Peça não encontrada" });
  }

  return res.json(peca);
});

/* atualizar peça e salvar histórico */
app.put("/api/pecas/:id", (req, res) => {
  const pecas = lerPecas();

  const id = limparId(req.params.id);

  const peca = pecas.find(p => p.id.toUpperCase() === id);

  if (!peca) {
    return res.status(404).json({ erro: "Peça não encontrada" });
  }

  const novoLocal = (req.body.local || "").trim();

  if (!novoLocal) {
    return res.status(400).json({ erro: "Local obrigatório" });
  }

  const agora = new Date();

  const horario = `${String(agora.getHours()).padStart(2, "0")}:${String(
    agora.getMinutes()
  ).padStart(2, "0")}`;

  const data = agora.toLocaleDateString("pt-BR");

  /* atualiza dados atuais da peça */
  peca.local = novoLocal;
  peca.horario = horario;

  /* define status baseado no local */
  const local = novoLocal.toLowerCase();

  if (local.includes("fund")) {
    peca.status = "Em Fundição";
  } else if (local.includes("usin")) {
    peca.status = "Em Usinagem";
  } else if (local.includes("estoq")) {
    peca.status = "Em Estoque";
  } else if (local.includes("trans")) {
    peca.status = "Em Transporte";
  } else {
    peca.status = "Em Processo";
  }

  /* garante que histórico existe */
  if (!peca.historico) {
    peca.historico = [];
  }

  /* adiciona novo registro no histórico */
  peca.historico.push({
    local: novoLocal,
    horario,
    data
  });

  /* salva tudo no arquivo */
  salvarPecas(pecas);

  return res.json({
    mensagem: "Atualizado com sucesso",
    dados: peca
  });
});

/* inicia servidor */
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});