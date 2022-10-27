const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

promisse.then(buscaMensagem);

function buscaMensagem(resposta) {
    const listaMensagem = resposta.data;
    const containerChat = document.querySelector(".container-chat");
    containerChat.innerHTML = "";
    console.log(listaMensagem);
    for (let i = 0; i <= listaMensagem.length; i++) {
        if (listaMensagem[i].type === "message") {
            containerChat.innerHTML += `            
            <li class="mensagem mensagem-global">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> para
                    <span>${listaMensagem[i].to}:</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        } else if (listaMensagem[i].type === "status") {
            containerChat.innerHTML += `            
            <li class="mensagem status">
                <h3>
                    <span class="horario">(${listaMensagem[i].time})</span> <span class="usuario">${listaMensagem[i].from}</span> ${listaMensagem[i].text}
                </h3>
            </li>
            `;
        }
    }
}
