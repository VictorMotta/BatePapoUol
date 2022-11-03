let usuario;
let usuarioReservado = "Todos";
const containerParticipantesHidden = document.querySelector(".container-fora-menu-participantes");
const buttonMenuParticipantes = document.querySelector("#menu-participantes");
const buttonFecharMenuParticipantes = document.querySelector("#button-fechar");
const mensagemPublica = document.querySelector("#input-mensagem-todos");
const containerMensagemPublica = document.querySelector(".container-hidden-mensagem-todos");
const mensagemReservada = document.querySelector("#input-mensagem-reservada");
const containerMensagemReservada = document.querySelector(".container-hidden-mensagem-reservado");
const inputNomeDeUsuario = document.querySelector("#nome-usuario");
const link = "https://mock-api.driven.com.br/api/v6/uol";

function salvaNomeUsuario() {
    const usuarioDigitado = document.querySelector("#nome-usuario").value;
    usuario = {
        name: usuarioDigitado.toLowerCase(),
    };

    entraNaSala();
}

function entraNaSala() {
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
    } else {
        window.location.reload();
    }
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

function buscaMensagem() {
    const promisse = axios.get(`${link}/messages`);

    promisse.then(carregaMensagem);
    setTimeout(scrollBar, 500);
}

function carregaMensagem(resposta) {
    const listaMensagem = resposta.data;
    const containerChat = document.querySelector(".container-chat");
    containerChat.innerHTML = "";
    for (let i = 0; i < listaMensagem.length; i++) {
        if (listaMensagem[i].type == "message") {
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-global" data-test="message">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> para
                    <span>${listaMensagem[i].to}:</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        } else if (listaMensagem[i].type == "status") {
            containerChat.innerHTML += `            
            <li class="mensagem status" data-test="message">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        } else if (
            listaMensagem[i].type == "private_message" &&
            usuario.name == listaMensagem[i].to
        ) {
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-reservada" data-test="message">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span>
                    <span class="usuario">${listaMensagem[i].from}</span> reservadamente para
                    <span class="mensagem-privada">${listaMensagem[i].to}:</span> ${listaMensagem[i].text}
                </h3>
                <ion-icon onclick="responderPrivado(this)" name="arrow-undo"></ion-icon>
            </li>
            `;
        } else if (
            listaMensagem[i].type == "private_message" &&
            usuario.name == listaMensagem[i].from
        ) {
            console.log(listaMensagem[i].to);
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-reservada" data-test="message">
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

function updateStatus() {
    const promisse = axios.post(`${link}/status`, usuario);
    promisse.then(verificaOnline);
}

function verificaOnline(resposta) {
    console.log("Conectado!");
}

function enviaMensagemPublica() {
    const mensagemDigitada = document.querySelector("#input-mensagem-todos").value;

    const textUsuario = usuario.name;

    let mensagem = {
        from: textUsuario,
        text: mensagemDigitada,
        to: "Todos",
        type: "message", // ou "private_message" para o bônus
    };

    const promise = axios.post(`${link}/messages/`, mensagem);
    promise.then(respostaEnvioMensagemPublica);
    promise.catch(errorEnvioMensagemPublica);
}

function respostaEnvioMensagemPublica(resposta) {
    buscaMensagem();
    const mensagemDigitada = document.querySelector("#input-mensagem-todos");
    mensagemDigitada.value = "";
    console.log("Enviado codigo mensagem publica: " + resposta.status);
    mensagemDigitada.placeholder = "Escreva aqui...";
    mensagemDigitada.style.border = "none";
}

function errorEnvioMensagemPublica(resposta) {
    const mensagemDigitada = document.querySelector("#input-mensagem-todos");
    if (resposta.response.status == 400) {
        if (mensagemDigitada.value == "") {
            mensagemDigitada.placeholder = "Digite alguma coisa antes de enviar!";
            mensagemDigitada.style.border = "1px solid red";
        } else {
            window.location.reload();
        }
    } else {
        window.location.reload();
    }
}

function enviaMensagemReservada() {
    const mensagemDigitada = mensagemReservada.value;
    const textUsuario = usuario.name;
    let mensagem = {
        from: textUsuario,
        text: mensagemDigitada,
        to: usuarioReservado,
        type: "private_message", // ou "private_message" para o bônus
    };
    console.log(mensagem);

    const promise = axios.post(`${link}/messages/`, mensagem);
    promise.then(respostaEnvioMensagemReservada);
    promise.catch(errorEnvioMensagemReservada);
    console.log(promise);
}

function respostaEnvioMensagemReservada(resposta) {
    buscaMensagem();
    mensagemReservada.value = "";
    console.log("Enviado codigo mensagem reservada: " + resposta.status);
    mensagemReservada.placeholder = "Escreva aqui...";
    mensagemReservada.style.border = "none";
}

function errorEnvioMensagemReservada(resposta) {
    if (resposta.response.status == 400) {
        if (mensagemReservada.value == "") {
            mensagemReservada.placeholder = "Digite alguma coisa antes de enviar!";
            mensagemReservada.style.border = "1px solid red";
        }
    } else {
        window.location.reload();
    }
}

function responderPrivado(valor) {
    const containerLi = valor.parentNode;

    usuarioReservado = containerLi.querySelector(".usuario").innerHTML;
    containerMensagemReservada.querySelector("#nome-usuario-enviar-reservado").innerHTML =
        usuarioReservado;
    containerMensagemPublica.classList.add("hidden");
    containerMensagemReservada.classList.remove("hidden");
}

function buscaUsuariosReservado() {
    const promise = axios.get(`${link}/participants`);

    promise.then(carregaUsuariosReservados);
    promise.catch(errorUsuariosReservados);
}

function carregaUsuariosReservados(resposta) {
    const listaUsuariosReservados = resposta.data;
    const containerUsuariosReservados = document.querySelector(".usuarios-participantes");
    console.log("Usuarios Carregado! codigo:" + resposta.status);
    containerUsuariosReservados.innerHTML = `
        <li onclick="selecionaUsuarioReservado(this)" data-test="all" class="lista-participantes todos-participantes selected">
        <ion-icon name="people"></ion-icon>
        <h3>Todos</h3>
        </li>
        `;
    for (let i = 0; i < listaUsuariosReservados.length; i++) {
        if (listaUsuariosReservados[i].name === usuario.name) {
            console.log("Entrou no if");
            continue;
        } else {
            containerUsuariosReservados.innerHTML += `
            <li onclick="selecionaUsuarioReservado(this)" data-test="participant" class="lista-participantes usuarios">
            <ion-icon name="person-circle"></ion-icon>
            <h3>${listaUsuariosReservados[i].name}</h3>
            </li>
            `;
        }
    }
}

function errorUsuariosReservados(resposta) {
    console.log(resposta.response.status);
}

function selecionaUsuarioReservado(usuarioR) {
    const seleciona = document.querySelector(".usuarios-participantes .selected");
    const msgBaixoInputReservado = document.querySelector("#nome-usuario-enviar-reservado");

    seleciona.classList.remove("selected");

    usuarioR.classList.add("selected");

    usuarioReservado = usuarioR.querySelector("h3").innerHTML;
    // imprime o nome do usuario reservado em baixo do input reservado
    msgBaixoInputReservado.innerHTML = usuarioReservado;
}

function selecionaVisibilidade(select) {
    const seleciona = document.querySelector(".escolhe-visibilidade .selected");

    seleciona.classList.remove("selected");

    select.classList.add("selected");

    if (select.id == "publico") {
        containerMensagemReservada.classList.add("hidden");
        containerMensagemPublica.classList.remove("hidden");
    } else if (select.id == "reservado") {
        containerMensagemPublica.classList.add("hidden");
        containerMensagemReservada.classList.remove("hidden");
    }
}

mensagemPublica.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        enviaMensagemPublica();
    }
});

mensagemReservada.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        enviaMensagemReservada();
    }
});

inputNomeDeUsuario.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        salvaNomeUsuario();
    }
});

buttonMenuParticipantes.addEventListener("click", (e) => {
    buscaUsuariosReservado();
    containerParticipantesHidden.classList.remove("hidden");
});

buttonFecharMenuParticipantes.addEventListener("click", (e) => {
    containerParticipantesHidden.classList.add("hidden");
});
