let idAtual = null;

function exibirPeca(peca){

    document.getElementById("resultado").innerHTML = `
        <h2> Dados da Peça</h2>

        <p><strong>Número:</strong> ${peca.id}</p>

        <p><strong>Lote:</strong> ${peca.lote}</p>

        <p><strong>Data de Fabricação:</strong> ${peca.dataFabricacao}</p>

        <p><strong>Local Atual:</strong> ${peca.local}</p>

        <p><strong>Última Atualização:</strong> ${peca.horario}</p>

        <p><strong>Status:</strong> Em Produção</p>
    `;
}

async function buscarPeca(id){

    try{

        const resposta = await fetch(`/api/pecas/${id}`);

        if(!resposta.ok){
            throw new Error();
        }

        const dados = await resposta.json();

        idAtual = id;

        exibirPeca(dados);

        tocarSom();

    }catch{

        alert("Peça não encontrada");
    }
}

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

        const resposta = await fetch(`/api/pecas/${idAtual}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                local
            })
        });

        const dados = await resposta.json();

        exibirPeca(dados.dados);

        document.getElementById("local").value = "";

        alert("Rastreabilidade atualizada com sucesso!");

    }catch{

        alert("Erro ao atualizar localização");
    }
}

function iniciarLeitor(){

    const leitor = new Html5QrcodeScanner(
        "reader",
        {
            fps:10,
            qrbox:250
        }
    );

    leitor.render((textoLido)=>{

        leitor.clear();

        buscarPeca(textoLido);

        setTimeout(()=>{
            iniciarLeitor();
        },2000);

    });
}

function tocarSom(){

    const audio = new Audio(
        "https://www.soundjay.com/buttons/sounds/button-3.mp3"
    );

    audio.play();
}

iniciarLeitor();

/* TRADUÇÃO DO LEITOR */

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
        inputImagem.setAttribute(
            "title",
            "Selecionar imagem"
        );
    }

    const textos = document.querySelectorAll("#reader div");

    textos.forEach(texto => {

        if(texto.innerText.includes("Or drop an image to scan")){
            texto.innerText =
            "Ou arraste uma imagem para leitura";
        }

        if(texto.innerText.includes("Choose Image")){
            texto.innerText =
            "Selecionar imagem";
        }

        if(texto.innerText.includes("Scan using camera directly")){
            texto.innerText =
            "Usar câmera";
        }

    });

}, 1000);