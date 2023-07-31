const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const server = http.createServer();

const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const wss = new WebSocket.Server({ server });
const connectedUsers = [];

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vitorhrds',
  password: 'vitor12345',
  database: 'chat_app_db',
});

// Conectar-se ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL.');
});

// Configurar o middleware body-parser para analisar o corpo das solicitações HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Rota para receber as mensagens do frontend e inseri-las no banco de dados
app.post('/api/mensagens', (req, res) => {
  const { sender, message } = req.body;
  
  if (!sender || !message) {
    return res.status(400).json({ error: 'O remetente e a mensagem são obrigatórios.' });
  }
  
  const query = 'INSERT INTO messages (sender, message) VALUES (?, ?)';
  connection.query(query, [sender, message], (err, result) => {
    if (err) {
      console.error('Erro ao inserir a mensagem no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao salvar a mensagem no banco de dados.' });
    }
    
    console.log('Mensagem salva no banco de dados:', result);
    
    return res.status(200).json({ message: 'Mensagem salva com sucesso.' });
  });
});

// Rota para consultar todas as mensagens associadas a um nome de usuário no banco de dados
app.get('/api/mensagens/:userName', (req, res) => {
  const userName = req.params.userName;
  const query = 'SELECT * FROM messages WHERE sender = ?';
  connection.query(query, [userName], (err, result) => {
    if (err) {
      console.error('Erro ao consultar mensagens do usuário:', err.message);
      return res.status(500).json({ error: 'Erro ao consultar mensagens do usuário.' });
    }
    
    console.log('Mensagem buscada no banco de dados com sucesso:', result);
    return res.status(200).json(result);
  });
});


// Iniciar o servidor
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORTA}`);
});



// Lidar com conexões de clientes via WebSocket
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado.');

  // Armazenar o nome do usuário associado ao WebSocket
  let userName = '';

  // Lidar com mensagens enviadas pelo cliente
  ws.on('message', (message) => {
    message = message.toString();
    // Verificar se a mensagem é uma mensagem especial com o novo nome do usuário
    if (message.startsWith('sys|')) {
      const [, oldName, newName] = message.split('|'); // Separar a mensagem especial em partes usando o caractere "|"

      // Verificar se o novo nome já está em uso
      if (connectedUsers.includes(newName)) {
        ws.send(`sys|O nome de usuário "${newName}" já está em uso. Por favor, escolha outro nome.`);
        return;
      }

      if (oldName !== newName) {
        // Se o novo nome for diferente do nome anterior, enviar a mensagem para todos os outros clientes conectados
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(`sys|${oldName}|${newName} mudou o nome`); // Enviar a mensagem especial para notificar a mudança de nome
          }
        });
        userName = newName; // Atualizar o nome do usuário associado ao WebSocket

        // Adicionar o novo nome de usuário à lista de usuários conectados
        connectedUsers.push(newName);
      }
    } else {
      // Se não for uma mensagem especial, proceder como antes
      console.log('Mensagem recebida:', message);
      // Enviar a mensagem recebida para todos os outros clientes conectados
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message); // Enviar a mensagem diretamente, sem alterações
        }
      });
    }
  });

  // Lidar com a desconexão de clientes
  ws.on('close', () => {
    console.log('Cliente desconectado.');

    // Remover o nome de usuário da lista de usuários conectados ao desconectar
    const index = connectedUsers.indexOf(userName);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
  });
});

server.on('request', (req, res) => {
  if (req.url === '/') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor.');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/styles.css') {
    fs.readFile('./styles.css', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor.');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else if (req.url === '/script.js') {
    fs.readFile('./script.js', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor.');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Página não encontrada.');
  }
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
