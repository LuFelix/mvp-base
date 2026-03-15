# 🐳 SEED-DOCKER.SH - GUIA DE USO

## O que é?

Um script shell **totalmente automatizado** que:

✅ Verifica se Docker está rodando
✅ Conecta ao container backend
✅ Executa o seed dentro do container
✅ Mostra TODOS os logs em tempo real no seu terminal
✅ Pede confirmação quando termina (você consegue ler tudo)
✅ Sai graciosamente

---

## 🚀 Como Usar

### Opção 1: Da pasta raiz do projeto (RECOMENDADO)

```bash
# Você está em /home/jaspion/projetos/mas-ia/
./backend/seed-docker.sh
```

### Opção 2: Da pasta do backend

```bash
# Você está em /home/jaspion/projetos/mas-ia/backend/
./seed-docker.sh
```

### Opção 3: Comando npm (rápido)

```bash
cd /home/jaspion/projetos/mas-ia/backend
npm run seed:verbose
```

---

## 📊 O que o Script Faz (Passo a Passo)

```
1️⃣  Detecta onde você está (backend, raiz ou frontend)
    ↓
2️⃣  Verifica se docker-compose está instalado
    ↓
3️⃣  Verifica se os containers estão rodando
    ↓
4️⃣  ENTRA no container backend
    ↓
5️⃣  EXECUTA npm run seed:verbose (TODOS OS LOGS)
    ↓
6️⃣  Mostra o resumo da execução
    ↓
7️⃣  PAUSA e pede confirmação para sair
    ↓
8️⃣  Você lê tudo, pressiona ENTER e sai
    ↓
✅ Concluído!
```

---

## 💡 Exemplo de Execução

```bash
$ ./seed-docker.sh

════════════════════════════════════════════════════════════
  🌱 SEED DOCKER - EXECUÇÃO AUTOMATIZADA
════════════════════════════════════════════════════════════

ℹ Detectando localização do projeto...
✓ Projeto encontrado em: .

▶ Etapa 1: Verificando docker-compose

✓ docker-compose disponível

▶ Etapa 2: Verificando status dos containers

Status atual:
✓ backend        ... Up
✓ frontend       ... Up
✓ db             ... Up

✓ Backend está rodando

▶ Etapa 3: Executando seed dentro do container backend

→ Conectando ao container backend...

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
  • Tempo de execução: 2.45s

Usuário Admin Padrão:
  • CPF: 00000000000
  • Email: admin@meusistema.com
  • Senha: Senha@123

▶ Etapa 4: Resumo da execução

✓ Seed executado com SUCESSO!

▶ Confirmação final

→ Você conseguiu acompanhar todo o log acima?
ℹ O script vai encerrar agora.

Pressione ENTER para confirmar e sair...
[Você pressiona ENTER aqui]

▶ Encerrando

✓ Script finalizado com sucesso!

ℹ Próximos passos:
  1. Abra seu frontend no navegador
  2. Faça login com:
    Email:  admin@meusistema.com
    Senha:  Senha@123
  3. Comece a usar o sistema! 🎉

```

---

## ✨ Características

| Característica | Detalhes |
|---|---|
| **Detecção automática** | Funciona de qualquer pasta do projeto |
| **Validação** | Verifica se docker e containers estão ok |
| **Logs em tempo real** | Você vê TODOS os logs enquanto executa |
| **Confirmação** | Pausa antes de sair para você ler tudo |
| **Códigos de saída** | Exit code 0 = sucesso, 1 = erro |
| **Mensagens coloridas** | Cores para facilitar leitura |

---

## 🆘 Resolução de Problemas

### "docker-compose: command not found"

```bash
# Instale docker-compose
apt-get install docker-compose

# Ou use docker compose (v2)
docker compose --version
```

### "Backend não está rodando!"

```bash
# Inicie todos os containers
docker-compose up -d

# Aguarde alguns segundos e tente de novo
./seed-docker.sh
```

### "ECONNREFUSED ao conectar no banco"

O banco está iniciando. Aguarde e tente novamente:

```bash
# Verifique status
docker-compose ps

# Aguarde ~10 segundos e tente de novo
./seed-docker.sh
```

### "Table does not exist"

Execute as migrations antes:

```bash
docker-compose exec backend npm run typeorm migration:run
./seed-docker.sh
```

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se está na pasta certa:
   ```bash
   pwd  # Deve ser /mas-ia ou /mas-ia/backend
   ```

2. Verifique se docker-compose está rodando:
   ```bash
   docker-compose ps
   ```

3. Veja os logs do container:
   ```bash
   docker-compose logs backend
   ```

4. Se precisar de ajuda, veja `SEEDING_GUIDE.md`

---

## 📁 Arquivos Relacionados

| Arquivo | Propósito |
|---------|-----------|
| `seed-docker.sh` | Este script automatizado |
| `seed.sh` | Script simples sem Docker |
| `src/run-seed.ts` | Lógica principal do seed |
| `SEEDING_GUIDE.md` | Documentação completa |

---

**Criado para facilitar a execução do seed em ambiente Docker!** 🌱
