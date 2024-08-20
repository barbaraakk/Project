# Use uma imagem base oficial do Node.js
FROM node:14

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código para o diretório de trabalho
COPY . .

# Exponha a porta que o aplicativo vai usar
EXPOSE 3000

# Defina o comando para iniciar o aplicativo
CMD ["node", "server/index.js"]
