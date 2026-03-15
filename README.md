# Ambiente de Desenvolvimento da Avaliação Técnica

Este repositório contém a configuração do Docker Compose e os arquivos necessários para orquestrar e executar todo o ambiente de desenvolvimento, que consiste em um backend em NestJS e um frontend em Angular.

## 🚀 Começando

Siga estas instruções para configurar e executar o ambiente de desenvolvimento completo em sua máquina local.

### Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem com o Docker Desktop)

### Instalação (Passo a Passo)

1.  **Crie uma pasta de trabalho e clone os repositórios:**

    ```bash
    # Crie uma pasta para o projeto
    mkdir workspace
    cd workspace

    # 1. Clone este repositório de orquestração
    git clone https://github.com/kelvinwbsantos/avaliacao-tecnica.git

    # 2. Clone o repositório do backend
    git clone https://github.com/kelvinwbsantos/back-nest-avaliacao-tecnica-1.git

    # 3. Clone o repositório do frontend
    git clone https://github.com/kelvinwbsantos/front-angular-avaliacao-tecnica-1.git
    ```

2.  **Navegue para a pasta do orquestrador:**

    ```bash
    cd avaliacao-tecnica
    ```

3.  **Configure as Variáveis de Ambiente:**

    Crie o arquivo `.env` na raiz desta pasta. Você pode copiar o arquivo de exemplo `env.example` (se você criar um).

    ```bash
    # Comando para criar o .env (opcional, se tiver o .env.example)
    # cp env.example .env

    # Abra o arquivo .env e preencha com suas configurações.
    # Exemplo de conteúdo para o .env:
    ```
    ```env
    # Database Configuration
    DB_TYPE=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name

    # PostgreSQL (para o container)
    POSTGRES_DB=your_database_name
    POSTGRES_USER=your_database_username
    POSTGRES_PASSWORD=your_database_password
    POSTGRES_PORT=5432

    # Backend Configuration
    BACKEND_PORT=3000
    NODE_ENV=development  # ou production

    # Frontend Configuration
    FRONTEND_PORT=4200

    # JWT Configuration
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=3600  # Tempo de expiração em segundos

    # API Configuration
    API_URL=http://localhost:3000

    # Gemini API Key
    GEMINI_API_KEY=your_gemini_api_key

    ```

4.  **Suba os contêineres:**

    Execute o seguinte comando para construir as imagens e iniciar todos os serviços em segundo plano.

    ```bash
    docker-compose up --build -d
    ```
    
4.  **Rode a seed inicial:**

    Execute o seguinte comando para inserir as roles iniciais e usuario Admin.

    ```bash
    docker exec nestjs_backend npm run seed
    ```

### Verificação

Após a execução, o ambiente estará disponível nos seguintes endereços:

* **Frontend (Angular):** http://localhost:4200
* **Backend (NestJS):** http://localhost:3000
* **Documentação da API (Swagger):** http://localhost:3000/api

### Comandos Úteis do Docker

* **Parar todos os serviços:**
    `docker-compose down`
* **Parar e remover os volumes (apaga o banco de dados):**
    `docker-compose down -v`
* **Acessar o terminal de um contêiner (ex: backend):**
    `docker exec nestjs_backend /bin/sh`
* **Ver os logs de um serviço específico (ex: backend):**
    `docker logs -f nestjs_backend`

### Estrutura de Pastas Esperada

Para que o `docker-compose.yml` funcione, sua estrutura de pastas local deve ser a seguinte:
```
/workspace/
|-- avaliacao-tecnica/  (Você está aqui)
|-- back-nest-avaliacao-tecnica-1/
|-- front-angular-avaliacao-tecnica-1/
```
