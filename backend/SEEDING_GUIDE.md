# 🌱 GUIA DE SEEDING - SCRIPT DETALHADO

## Visão Geral

O novo script de seed (`src/run-seed.ts`) foi criado para **popular o banco de dados** com dados iniciais de forma didática e bem documentada, mostrando cada etapa do processo no terminal.

---

## 📋 O que o Script Faz

1. **Inicializa a aplicação NestJS** - Carrega todos os módulos
2. **Testa a conexão com o banco** - Verifica se o PostgreSQL está acessível
3. **Conta dados existentes** - Mostra quantos Roles e Usuários já existem
4. **Executa o seeding** - Cria 3 Roles e 1 Usuário Admin
5. **Verifica resultado** - Confirma o que foi criado com sucesso
6. **Exibe resume com credenciais** - Mostra os dados de acesso

---

## 🚀 Como Executar

### ⭐ Opção 1: No Docker (RECOMENDADO - Production)

Se você está usando `docker-compose` para subir o projeto completo (frontend + backend):

#### Método A: Script automatizado (MAIS FÁCIL)

```bash
# Na pasta raiz do projeto (mas-ia/)
./backend/seed-docker.sh

# Ou na pasta do backend
./seed-docker.sh
```

Este script vai:
- ✓ Executar o seed dentro do container backend
- ✓ Mostrar todos os logs em tempo real
- ✓ Pedir confirmação para sair (você consegue ver tudo)
- ✓ Limpar automaticamente ao finalizar

#### Método B: Comando direto (Manual)

```bash
# Terminal na pasta raiz do projeto (mas-ia/) ou backend/
docker-compose exec backend npm run seed:verbose

# Ou se quiser permanecer conectado ao container para acompanhar:
docker-compose exec -it backend npm run seed:verbose
```

Se usa comando manual, você verá:
- Todos os logs coloridos em tempo real
- Cada etapa do seeding mostrando no seu terminal
- Pressione `Ctrl+C` para sair quando terminar

#### Método C: Entrar no container e rodar manualmente

```bash
# 1. Entre no container do backend
docker-compose exec -it backend bash

# 2. Agora você está DENTRO do container, rode:
npm run seed:verbose

# 3. Para sair do container:
exit
```

---

### Opção 2: Localmente (Development)

Se você está rodando o backend fora do Docker:

```bash
# Na pasta './backend' do seu projeto
npm run seed:verbose
```

---

### Opção 3: Com ts-node direto

```bash
ts-node -r tsconfig-paths/register src/run-seed.ts
```

---

## 📊 Dados que Serão Criados

### Roles (Funções)
- ✓ `colaborador`
- ✓ `administrador`
- ✓ `gente_e_cultura`

### Usuário Administrador
```
CPF:      00000000000
Email:    admin@meusistema.com
Senha:    Senha@123
Nome:     Usuário Administrador
Role:     administrador
```

---

## 📝 Output Esperado no Terminal

O script exibe logs coloridos mostrando cada etapa:

```
═══════════════════════════════════════════════════════════
  🌱 SCRIPT DE SEED - POPULAÇÃO INICIAL DO BANCO
═══════════════════════════════════════════════════════════

▶ Etapa 1: Inicializando aplicação NestJS
  → Carregando módulos...
✓ Aplicação NestJS inicializada com sucesso

▶ Etapa 2: Verificando conexão com banco de dados
  → Testando conexão...
✓ Conexão com banco de dados estabelecida
  → Database: meusistema

▶ Etapa 3: Verificando dados existentes
ℹ Roles existentes: 0
ℹ Usuários existentes: 0

▶ Etapa 4: Executando processo de seeding
  → Criando roles padrão...
  → Criando usuário administrador...

▶ Etapa 5: Verificando resultado final
ℹ Roles criadas: 3
ℹ Usuários criados: 1
  → Roles no banco:
    • colaborador
    • administrador
    • gente_e_cultura

═══════════════════════════════════════════════════════════
✅ SEEDING CONCLUÍDO COM SUCESSO!
═══════════════════════════════════════════════════════════

Resumo:
  • Total de Roles: 3
  • Total de Usuários: 1
  • Tempo de execução: 2.34s

Usuário Admin Padrão:
  • CPF: 00000000000
  • Email: admin@meusistema.com
  • Senha: Senha@123

Para entrar no dashboard, use as credenciais acima.
```

---

## 🎨 Sistema de Cores do Script

O script usa cores para facilitar a leitura:

| Símbolo | Cor    | Significado |
|---------|--------|------------|
| ✓       | Verde  | Sucesso / Ação concluída |
| ✗       | Vermelho | Erro |
| ℹ       | Ciano  | Informação |
| ⚠       | Amarelo | Aviso |
| ▶       | Azul   | Seção/Etapa |

---

## ⚠️ Tratamento de Erros

Se algo der errado, o script:

1. **Exibe o erro em detalhes** - Nome, mensagem e stack trace
2. **Mostra tempo de execução** - Para debug
3. **Encerra graciosamente** - Fecha a aplicação corretamente
4. **Retorna exit code 1** - Para CI/CD saber que falhou

---

## 🔧 Arquivos Relacionados

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/run-seed.ts` | Script principal com logs detalhados |
| `src/seed.ts` | Script original (mais simples) |
| `src/seeds/seed.service.ts` | Lógica de seeding (Roles e Usuário) |
| `src/seeds/seed.module.ts` | Módulo NestJS do seed |

---

## 💡 Dicas Úteis

### Se rodar duas vezes
O script é **idempotente** (seguro rodar várias vezes). Se os dados já existem:
- As Roles não serão duplicadas
- O usuário admin não será duplicado
- O script apenas informará que já existem

### Se precisar limpar tudo
```sql
-- Conecte ao banco PostgreSQL
DELETE FROM users;
DELETE FROM roles;
-- Depois rode o seed de novo
```

### Se estiver no Docker (RECOMENDADO)

Você está usando `docker-compose` para rodar frontend, backend e banco? Ótimo! É o uso principal:

```bash
# Da pasta raiz do projeto (mas-ia/)
docker-compose exec backend npm run seed:verbose

# Ou use o script automatizado (recomendado):
./backend/seed-docker.sh
```

O script `seed-docker.sh` é mais completo e:
- Entra no container automaticamente
- Mostra todos os logs
- Permite você acompanhar em tempo real
- Pede confirmação para sair (você vê tudo)

---

## 📞 Troubleshooting

### "Connection refused"
→ PostgreSQL não está rodando. Execute: `docker-compose up -d`

### "ECONNREFUSED"
→ Verifique se as variáveis de ambiente `.env` estão corretas

### "Table does not exist"
→ Execute as migrations antes do seed: `npm run typeorm migration:run`

### Demora muito tempo
→ Normal se for a primeira execução. Pode levar 5-10 segundos

---

## 📌 Próximos Passos

Após rodar o seed com sucesso:

1. ✅ Acesse o frontend em seu navegador
2. ✅ Faça login com as credenciais do admin
3. ✅ Comece a usar o sistema!

```
Email: admin@meusistema.com
Senha: Senha@123
```

---

**Criado em**: 2024 | **Versão**: 1.0 | **Status**: Production-Ready ✅
