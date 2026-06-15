
let idAtual = null;

/*  LIMPAR QR CODE */
function limparQR(texto) {
    return (texto || "")
        .toString()
        .replace("peca:", "")
        .replace("PEC:", "")
        .trim()
        .toUpperCase();
}

/*  EXIBIR PEÇA */
function exibirPeca(peca){

    let historicoHTML = "";

    peca.historico
    .slice()
    .reverse()
    .forEach(item => {

        historicoHTML += `
            <tr>
                <td>${item.horario}</td>
                <td>${item.local}</td>
            </tr>
        `;
    });

    document.getElementById("resultado").innerHTML = `
        <h2>Dados da Peça</h2>

        <p><strong>Número:</strong> ${peca.id}</p>
        <p><strong>Lote:</strong> ${peca.lote}</p>
        <p><strong>Data de Fabricação:</strong> ${peca.dataFabricacao}</p>
        <p><strong>Local Atual:</strong> ${peca.local}</p>
        <p><strong>Última Atualização:</strong> ${peca.horario}</p>
        <p><strong>Status:</strong> ${peca.status}</p>

        <div class="historico-container">
            <h3>Histórico de Movimentação</h3>

            <table class="tabela-historico">
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Local</th>
                    </tr>
                </thead>
                <tbody>
                    ${historicoHTML}
                </tbody>
            </table>
        </div>
    `;
}

/* BUSCAR PEÇA */
async function buscarPeca(id){

    try{

        const idLimpo = limparQR(id);

        const resposta = await fetch(`/api/pecas/${idLimpo}`);

        if(!resposta.ok){
            const erro = await resposta.json();
            console.log(erro);
            throw new Error();
        }

        const dados = await resposta.json();

        idAtual = idLimpo;

        exibirPeca(dados);

        tocarSom();

    }catch(error){
        console.log(error);
        alert("Peça não encontrada");
    }
}

/* ATUALIZAR LOCAL */
async function atualizarLocal(){

    if(!idAtual){
        alert("Leia um QR Code primeiro");
        return;
    }

    const local = document.getElementById("local").value;

    if(local.trim() === ""){
        alert("Digite um local");
        return;
    }

    try{

        const resposta = await fetch(`/api/pecas/${idAtual}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ local })
        });

        if(!resposta.ok){
            const erro = await resposta.json();
            console.log(erro);
            throw new Error();
        }

        const dados = await resposta.json();

        exibirPeca(dados.dados);

        document.getElementById("local").value = "";

        alert("Movimentação registrada com sucesso!");

    }catch(error){
        console.log(error);
        alert("Erro ao atualizar localização");
    }
}

/* LEITOR QR CODE */
function iniciarLeitor(){

    const leitor = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: 250
        }
    );

    leitor.render((textoLido) => {

        leitor.clear();

        // IMPORTANTE
        buscarPeca(textoLido);

        setTimeout(() => {
            iniciarLeitor();
        }, 2000);

    });
}

/* SOM */
function tocarSom(){

    const audio = new Audio(
        "https://www.soundjay.com/buttons/sounds/button-3.mp3"
    );

    audio.play();
}

iniciarLeitor();

/* TRADUÇÃO DO SCANNER */
setTimeout(() => {

    const trocarCamera = document.getElementById(
        "reader__dashboard_section_swaplink"
    );

    if(trocarCamera){
        trocarCamera.innerText = "Usar câmera";
    }

    const inputImagem = document.getElementById(
        "reader__filescan_input"
    );

    if(inputImagem){
        inputImagem.setAttribute("title", "Selecionar imagem");
    }

    const textos = document.querySelectorAll("#reader div");

    textos.forEach(texto => {

        if(texto.innerText.includes("Or drop an image to scan")){
            texto.innerText = "Ou arraste uma imagem para leitura";
        }

        if(texto.innerText.includes("Choose Image")){
            texto.innerText = "Selecionar imagem";
        }

        if(texto.innerText.includes("Scan using camera directly")){
            texto.innerText = "Usar câmera";
        }

    });

}, 1000);