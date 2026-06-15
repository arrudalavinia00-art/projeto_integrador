let idAtual = null;

/* VIBRAÇÃO */
function vibrar() {
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}

/* LIMPAR QR */
function limparQR(texto) {
  return (texto || "")
    .toString()
    .replace(/peca:|PEC:/gi, "")
    .trim()
    .toUpperCase();
}

/* EXIBIR PEÇA */
function exibirPeca(peca) {
  if (!peca) return;

  let historicoHTML = "";

  (peca.historico || [])
    .slice()
    .reverse()
    .forEach(item => {
      historicoHTML += `
        <tr>
          <td>${item.data || "-"}</td>
          <td>${item.horario || "-"}</td>
          <td>${item.local || "-"}</td>
        </tr>
      `;
    });

  document.getElementById("resultado").innerHTML = `
    <h2>Dados da Peça</h2>

    <p><strong>Número:</strong> ${peca.id}</p>
    <p><strong>Lote:</strong> ${peca.lote}</p>
    <p><strong>Data de Fabricação:</strong> ${peca.dataFabricacao}</p>
    <p><strong>Local:</strong> ${peca.local}</p>
    <p><strong>Horário:</strong> ${peca.horario}</p>
    <p><strong>Status:</strong> ${peca.status}</p>

    <h3>Histórico</h3>

    <table border="1">
      <tr>
        <th>Data</th>
        <th>Horário</th>
        <th>Local</th>
      </tr>
      ${historicoHTML}
    </table>
  `;
}

/* BUSCAR PEÇA */
async function buscarPeca(id) {
  try {
    const idLimpo = limparQR(id);

    const resposta = await fetch(`/api/pecas/${idLimpo}`);

    if (!resposta.ok) throw new Error("Não encontrado");

    const dados = await resposta.json();

    idAtual = idLimpo;

    vibrar();

    exibirPeca(dados);

  } catch (err) {
    alert("Peça não encontrada");
  }
}

/* ATUALIZAR LOCAL */
async function atualizarLocal() {
  if (!idAtual) {
    alert("Leia um QR Code primeiro");
    return;
  }

  const local = document.getElementById("local").value;

  if (!local.trim()) {
    alert("Digite um local");
    return;
  }

  const resposta = await fetch(`/api/pecas/${idAtual}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ local })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert("Erro ao atualizar");
    return;
  }

  exibirPeca(dados.dados);

  document.getElementById("local").value = "";

  alert("Atualizado com sucesso!");
}

/* QR CODE */
function iniciarLeitor() {
  const leitor = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 },
    false
  );

  leitor.render((textoLido) => {
    const id = limparQR(textoLido);
    buscarPeca(id);
  });
}

iniciarLeitor();