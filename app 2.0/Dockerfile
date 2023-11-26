# Use a imagem Node.js oficial como base
FROM node:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR app1

# Copie o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Exponha a porta em que o aplicativo irá escutar
EXPOSE 4000

# Comando para iniciar o aplicativo
CMD [ "node", "server.js" ]
