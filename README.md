# MandZatsu Website

## Descrição

O **MandZatsu Website** é um projeto web que exibe um site com páginas de política de privacidade e termos de serviço. Utiliza o framework **Express** para o backend e serve arquivos estáticos a partir da pasta `public`. O projeto está configurado para ser executado em um ambiente Docker e também pode ser iniciado localmente.

## Estrutura do Projeto

project/
├── dockerfile
├── gitignore
├── package.json
├── public/
│ ├── index.html
│ ├── privacy-policy.html
│ ├── terms.html
│ └── style.css
└── server/
└── index.js

- **`public/`**: Contém os arquivos estáticos do site, incluindo HTML, CSS e outros recursos.
  - **`index.html`**: Página inicial do site.
  - **`privacy-policy.html`**: Página com a política de privacidade.
  - **`terms.html`**: Página com os termos de serviço.
  - **`style.css`**: Folha de estilo CSS utilizada para estilizar as páginas.

- **`server/`**: Contém o código do servidor.
  - **`index.js`**: Configuração do servidor Express.

- **`dockerfile`**: Arquivo para construir a imagem Docker do projeto.

- **`package.json`**: Gerencia dependências e scripts do projeto.

- **`.gitignore`**: Arquivo para ignorar arquivos e pastas não desejados no controle de versão.

## Instruções de Configuração

### Executando Localmente

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd project

2. Instale as dependências:

    npm install

3. Inicie o servidor:
    npm start
    O servidor estará disponível em http://localhost:3000.


Executando com Docker

1. Construa a imagem Docker:
    docker build -t mandzatsu-website.

2. Execute o contêiner:
    docker run -p 3000:3000 mandzatsu-website

O servidor estará disponível em http://localhost:3000.


Estrutura do Dockerfile
    Imagem base: Utiliza a imagem oficial do Node.js node:14.
    Diretório de trabalho: Define o diretório /app.
    Dependências: Instala as dependências listadas no package.json.
    Comando inicial: Inicia o aplicativo com node server/index.js.


Licença
    Este projeto está licenciado sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.