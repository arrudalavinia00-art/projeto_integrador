const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

let pecas = [
  {
    id: "PEC001",
    lote: "LT2025",
    dataFabricacao: "01/06/2025",
    local: "Fundição",
    horario: "08:30",
    status: "Em Produção"
  },
  {
    id: "PEC002",
    lote: "LT2025",
    dataFabricacao: "01/06/2025",
    local: "Usinagem",
    horario: "09:10",
    status: "Em Transporte"
  }
];

app.get("/api/pecas/:id", (req, res) => {

  const peca = pecas.find(
    p => p.id.toUpperCase() === req.params.id.toUpperCase()
  );

  if (!peca) {
    return res.status(404).json({
      erro: "Peça não encontrada"
    });
  }

  res.json(peca);
});

app.put("/api/pecas/:id", (req, res) => {

  const peca = pecas.find(
    p => p.id.toUpperCase() === req.params.id.toUpperCase()
  );

  if (!peca) {
    return res.status(404).json({
      erro: "Peça não encontrada"
    });
  }

  const novoLocal = req.body.local;

  if (!novoLocal) {
    return res.status(400).json({
      erro: "O local é obrigatório"
    });
  }

  peca.local = novoLocal;

  peca.horario = new Date().toLocaleTimeString("pt-BR");

  if (novoLocal.toLowerCase().includes("fund")) {
    peca.status = "Em Fundição";
  } 
  else if (novoLocal.toLowerCase().includes("usin")) {
    peca.status = "Em Usinagem";
  } 
  else if (novoLocal.toLowerCase().includes("estoque")) {
    peca.status = "Em Estoque";
  } 
  else if (novoLocal.toLowerCase().includes("trans")) {
    peca.status = "Em Transporte";
  } 
  else {
    peca.status = "Em Processo";
  }

  res.json({
    mensagem: "Peça atualizada com sucesso",
    dados: peca
  });
});

app.get("/api/pecas", (req, res) => {
  res.json(pecas);
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando na rede local!');
});

 