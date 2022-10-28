let usuario;

const link = "https://mock-api.driven.com.br/api/v6/uol";

function buscaMensagem() {
    const promisse = axios.get(`${link}/messages`);

    promisse.then(carregaMensagem);
    setTimeout(scrollBar, 500);
}

function carregaMensagem(resposta) {
    const listaMensagem = resposta.data;
    const containerChat = document.querySelector(".container-chat");
    containerChat.innerHTML = "";
    for (let i = 0; i <= listaMensagem.length; i++) {
        if (listaMensagem[i].type == "message") {
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-global">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> para
                    <span>${listaMensagem[i].to}:</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        } else if (listaMensagem[i].type == "status") {
            containerChat.innerHTML += `            
            <li class="mensagem status">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        } else if (listaMensagem[i].type === "private_message" && listaMensagem[i].to == usuario) {
            console.log(listaMensagem[i].to);
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-reservada">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span>
                    <span class="usuario">${listaMensagem[i].from}</span> reservadamente para
                    <span class="mensagem-privada">${listaMensagem[i].to}:</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        }
    }
}

function scrollBar() {
    const elementoQueQueroQueApareca = document.querySelectorAll(".mensagem");
    if (elementoQueQueroQueApareca != undefined) {
        elementoQueQueroQueApareca.forEach((i) => {
            i.scrollIntoView();
        });
    }
}

function entraNaSala() {
    console.log(usuario);
    const promisse = axios.post(`${link}/participants`, usuario);
    promisse.then((resposta) => {
        loadingEntraSala();
        buscaMensagem();
        setInterval(buscaMensagem, 3000);
        setInterval(updateStatus, 5000);
    });
    promisse.catch(errorEntraSala);
}

function errorEntraSala(resposta) {
    console.log(resposta);
    if (resposta.response.status === 400) {
        const mostraInput = document.querySelector(".container-total-login");
        const apagaLoading = document.querySelector(".container-loading");
        const mostraMenuLogin = document.querySelector(".container-hidden-login");
        const nomeUsuarioInput = document.querySelector("#nome-usuario");
        nomeUsuarioInput.value = "";
        nomeUsuarioInput.placeholder = "Esse nome já está em uso!";
        nomeUsuarioInput.style.border = "1px solid red";
        mostraMenuLogin.classList.remove("hidden");
        apagaLoading.classList.add("hidden");
        mostraInput.classList.remove("hidden");
    }
}

function updateStatus() {
    const promisse = axios.post(`${link}/status`, usuario);
    promisse.then(verificaOnline);
}

function verificaOnline(resposta) {
    console.log("Conectado!");
}

function enviaMensagem() {
    const mensagemDigitada = document.querySelector("#envia-mensagem").value;
    console.log(typeof mensagemDigitada);
    const textUsuario = usuario.name;

    let mensagem = {
        from: textUsuario,
        text: mensagemDigitada,
        to: "Todos",
        type: "message", // ou "private_message" para o bônus
    };

    const promise = axios.post(`${link}/messages/`, mensagem);
    promise.then(respostaEnvio);
    promise.catch(errorEnvio);
}
function respostaEnvio(resposta) {
    buscaMensagem();
    const mensagemDigitada = document.querySelector("#envia-mensagem");
    mensagemDigitada.value = "";
    console.log("Enviado codigo: " + resposta.status);
    mensagemDigitada.placeholder = "Escreva aqui...";
    mensagemDigitada.style.border = "none";
}

function errorEnvio(resposta) {
    const mensagemDigitada = document.querySelector("#envia-mensagem");
    if (resposta.response.status == 400) {
        if (mensagemDigitada.value == "") {
            mensagemDigitada.placeholder = "Digite alguma coisa antes de enviar!";
            mensagemDigitada.style.border = "1px solid red";
        }
    } else {
        window.location.reload();
    }
}

function salvaNomeUsuario(valor) {
    const usuarioDigitado = document.querySelector("#nome-usuario").value;
    usuario = {
        name: usuarioDigitado,
    };

    entraNaSala();
}

function loadingEntraSala() {
    const apagaInput = document.querySelector(".container-total-login");
    const amostraLoading = document.querySelector(".container-loading");
    const apagaMenuLogin = document.querySelector(".container-hidden-login");
    const nomeUsuarioInput = document.querySelector("#nome-usuario");
    apagaInput.classList.add("hidden");
    amostraLoading.classList.remove("hidden");

    nomeUsuarioInput.placeholder = "Digite seu nome";
    nomeUsuarioInput.border = "none";

    setTimeout(() => {
        apagaMenuLogin.classList.add("hidden");
    }, 500);
}
