const socket = new WebSocket('wss://chat-app-ea03.onrender.com');
const chatWindow = document.getElementById('chat-messages');

const nameInput = document.getElementById('name-input');
const userNameDisplay = document.getElementById('user-name-display');

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let userName = '';
const messageHistory = [];

function conectarUsuario() {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Digite um nome de usuário válido.');
    return;
  }

  userName = name;
  userNameDisplay.textContent = userName;
  nameInput.classList.add('hidden');

  enviarMensagemEspecial(`${userName} entrou no chat`);

  messageHistory.push({
    sender: 'Sistema',
    message: `${userName} entrou no chat`,
  });

  // Solicitar ao servidor WebSocket as mensagens associadas ao nome de usuário
  socket.send(`get_messages|${userName}`);

  updateChatUI();
}

function enviarMensagem() {
  const message = messageInput.value.trim();
  if (message !== '') {
    appendMessage(userName, message, 'own');
    enviarMensagemNormal(userName, message);
    messageInput.value = '';
  }
}

function enviarMensagemEspecial(message) {
  socket.send(`sys|${message}`);
  if (message.startsWith(`${userName} mudou o nome para `)) {
    const newName = message.split('para ')[1];
    updateMessageHistory(userName, newName);
    userName = newName;
    userNameDisplay.textContent = newName;
  }
}

function enviarMensagemNormal(sender, message) {
  socket.send(`${sender}|${message}`);

    // Enviar a mensagem para o servidor backend
    fetch('http://localhost:3306/api/mensagens/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, message }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        console.log("DEU CERTO");
        // Faça algo aqui, se necessário, após a mensagem ser salva no banco de dados.
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem para o servidor backend:', error);
      });
}

nameInput.addEventListener('blur', () => {
  const newName = nameInput.value.trim();
  if (newName !== userName) {
    enviarMensagemEspecial(`${userName} mudou o nome para ${newName}`);
    userName = newName;
    userNameDisplay.textContent = newName;
    updateMessageHistory(userName, newName);

    // Chamar a função para consultar as mensagens do usuário
    consultarMensagensDoUsuario(userName); // <--- Adicionar essa linha aqui
  }
});

document.getElementById('user-name-display').addEventListener('click', () => {
  nameInput.classList.remove('hidden');
  nameInput.focus();
});

document.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    if (nameInput === document.activeElement) {
      messageInput.focus();
    } else {
      enviarMensagem();
    }
  }
});

// Evento de envio do formulário (mudanças aqui)
document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o envio do formulário padrão

  enviarMensagem(); // Chama a função para enviar a mensagem
});

sendButton.addEventListener("click", enviarMensagem);

socket.addEventListener('message', (event) => {
  const messageData = event.data;

  if (messageData.startsWith('sys|')) {
    const [, message] = messageData.split('|');
    appendMessage('Sistema', message, 'system');
  } else if (messageData.startsWith('get_messages|')) {
    console.log("AQUI FOI"); // <--- Correção aqui
    const [, userName] = messageData.split('|');
    consultarMensagensDoUsuario(userName); // <--- Chamar a função para consultar mensagens
  } else {
    console.log("AGR SIM");
    const [sender, message] = messageData.split('|');
    appendMessage(sender, message, 'other');
  }
  scrollToBottom();
});

function appendMessage(sender, message, messageType) {
  const messageContainer = document.createElement('div');
  messageContainer.className = `message-container ${messageType}`;

  const messageElement = document.createElement('div');
  messageElement.className = `message-container ${sender === userName ? 'own' : 'other'}`;

  if (message.startsWith('sys|')) {
    messageElement.innerHTML = `
      <div class="message system">
        <strong class="sender">${message.substring(4)}</strong>
      </div>
    `;
  } else {
    if (sender === 'Sistema' && message.includes('mudou o nome para')) {
      messageElement.innerHTML = `
        <div class="message system">
          <strong class="sender">${message}</strong>
        </div>
      `;
    } else {
      messageElement.innerHTML = `
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="message ${sender === userName ? 'own' : 'other'}">
          <strong class="sender">${sender === userName ? 'Você' : sender}:</strong> ${message}
        </div>
      `;
    }
  }

  messageContainer.appendChild(messageElement);
  chatWindow.appendChild(messageContainer);
  scrollToBottom();
}

function updateMessageHistory(oldName, newName) {
  for (const message of messageHistory) {
    if (message.sender === oldName) {
      message.sender = newName;
      const messageContainer = document.querySelector(`.message-container[data-key="${key}"]`);
      if (messageContainer) {
        const messageElement = messageContainer.querySelector('.message');
        if (messageElement) {
          messageElement.textContent = newName === userName ? 'Você' : newName;
        }
      }
    }
  }
}

// Função para consultar todas as mensagens associadas a um nome de usuário no banco de dados
async function consultarMensagensDoUsuario(userName) {
  try {
    const response = await fetch(`http://localhost:3306/api/mensagens/${userName}`);
    const data = await response.json();

    // Limpar o chat antes de exibir as mensagens recuperadas
    chatWindow.innerHTML = '';

    // Exibir as mensagens recuperadas no chat
    data.forEach((row) => {
      // Aqui está a chamada à função appendMessage para exibir as mensagens recuperadas
      if (row.sender === userName) {
        appendMessage(row.sender, row.message, 'own');
      }
      // else {
      //   appendMessage(row.sender, row.message, 'other');
      // }
    });
  } catch (error) {
    console.error('Erro ao consultar mensagens do usuário:', error);
  }
}


// Evento quando um novo nome de usuário é inserido
nameInput.addEventListener('blur', () => {
  const newName = nameInput.value.trim();
  if (newName !== userName) {
    enviarMensagemEspecial(`${userName} mudou o nome para ${newName}`);
    userName = newName;
    userNameDisplay.textContent = newName;

    // Agora, ao invés de chamar a função para consultar as mensagens do usuário aqui,
    // as mensagens serão recebidas automaticamente do servidor WebSocket.
    updateMessageHistory(userName, newName);
    consultarMensagensDoUsuario(newName); // Adicione esta chamada aqui

  }
});


function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
