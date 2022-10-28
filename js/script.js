let usuario;

function buscaMensagem() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

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
    usuario = {
        name: prompt("Qual o nome do usuário?"),
    };
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", usuario);
    promisse.then((resposta) => {
        console.log("Entrou na sala!");
    });
    promisse.catch(errorEntraSala);
}

function errorEntraSala(resposta) {
    if (resposta.response.status === 400) {
        alert("Esse nome de usuário ja existe, digite outro inexistente!");
        entraNaSala();
    }
}

function updateStatus() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
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

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/", mensagem);
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
    if (resposta.response.status == 404) {
        window.location.reload();
    } else if (resposta.response.status == 400) {
        if (mensagemDigitada.value == "") {
            mensagemDigitada.placeholder = "Digite alguma coisa antes de enviar!";
            mensagemDigitada.style.border = "1px solid red";
        }
    }
}

buscaMensagem();
setInterval(buscaMensagem, 3000);
entraNaSala();
setInterval(updateStatus, 5000);
