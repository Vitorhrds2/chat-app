const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Configurar rota para servir o arquivo HTML do frontend
server.on('request', (req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Chat App</title>
      </head>
            <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      
      .chat-container {
        max-width: 400px;
        margin: 100px auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      
      .chat-header {
        background-color: #ffffff;
        color: rgb(232, 74, 74);
        padding: 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      
      .chat-messages {
        padding: 10px;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        font-size: 15px;
      }
      
      .chat-messages .message {
        margin-bottom: 10px;
        padding: 5px 10px;
        border-radius: 5px;
      }
      
      .chat-messages .own-message {
        background-color: #007BFF;
        color: #fff;
      }
      
      .chat-messages .other-message {
        background-color: #f0f0f0;
        color: #333;
      }
      
      .chat-input {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ccc;
      }
      
      .chat-input input[type="text"] {
        flex: 1;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
      }
      
      .chat-input button {
        padding: 5px 10px;
        margin-left: 10px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      
      </style>
      <body>
        <div class="chat-container">
        <div class="chat-header">Intelipslop</div>
        <div class="chat-messages" id="chat-messages">
          <!-- Mensagens do chat serão adicionadas aqui dinamicamente -->
        </div>
        <div class="chat-input">
          <input type="text" id="message-input" placeholder="Digite sua mensagem...">
          <button id="send-button">Enviar</button>
        </div>
      </div>
        
        <script>
          const socket = new WebSocket('wss://chat-app-ea03.onrender.com');

          const chatWindow = document.getElementById('chat-messages');
          const messageInput = document.getElementById('message-input');
          const sendButton = document.getElementById('send-button');

          // Função para enviar a mensagem
          function enviarMensagem() {
            const message = messageInput.value.trim();
            if (message !== '') {
              // Coloque o código que deseja executar quando Enter for pressionado ou botão for clicado
              appendMessage('Voce', message);
              socket.send(message); // Enviando a mensagem como string
              messageInput.value = '';
            }
          }
      
          // Adicionando o EventListener para a tecla "Enter"
          document.addEventListener('keypress', (event) => {
            if (event.key === "Enter") {
              enviarMensagem();
            }
          });
      
          // Adicionando o EventListener para o clique do botão
          sendButton.addEventListener("click", enviarMensagem);
          
          socket.addEventListener('message', (event) => {
            const messageBlob = event.data;
          
            // Converter o Blob para texto (string)
            const reader = new FileReader();
            reader.onload = function () {
              const message = reader.result;
              appendMessage('Outro Usuario', message);
            };
            reader.onerror = function () {
              console.error('Erro ao ler o Blob:', reader.error);
            };
            reader.readAsText(messageBlob);
          });
          
          
          function appendMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = \`<strong>\${sender}:</strong> \${message}\`;
            chatWindow.appendChild(messageElement);
          }
        </script>
      </body>
      </html>
    `);
  }
});

// Lidar com conexões de clientes via WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado.');
  
    // Lidar com mensagens enviadas pelo cliente
    ws.on('message', (message) => {
      console.log('Mensagem recebida:', message);
  
      // Enviar a mensagem recebida para todos os outros clientes conectados
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message); // Enviar a mensagem diretamente, sem alterações
        }
      });
    });
  
    // Lidar com a desconexão de clientes
    ws.on('close', () => {
      console.log('Cliente desconectado.');
    });
  });

server.listen(PORT, () => {
  console.log(`Servidor rodando em https://chat-app-ea03.onrender.com/`);
});
