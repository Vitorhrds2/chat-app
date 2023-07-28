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
        <title>WebSocket Chat</title>
      </head>
      <body>
        <h1>WebSocket Chat</h1>
        <div id="chat-window"></div>
        <input type="text" id="message-input" placeholder="Digite sua mensagem...">
        <button id="send-button">Enviar</button>
        
        <script>
          const socket = new WebSocket('ws://localhost:${PORT}');

          const chatWindow = document.getElementById('chat-window');
          const messageInput = document.getElementById('message-input');
          const sendButton = document.getElementById('send-button');

          sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message !== '') {
              appendMessage('Voce', message);
              socket.send(message); // Enviando a mensagem como string
              messageInput.value = '';
            }
          });
          
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
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
