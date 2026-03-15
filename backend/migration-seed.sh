#!/bin/bash

# ============================================================================
# MIGRATION-SEED.SH - EXECUTA SEED (MIGRATIONS RODAM AUTOMÁTICAS)
# ============================================================================
#
# Este script:
# 1. Verifica se Docker está rodando
# 2. Aguarda o banco ficar pronto
# 3. Executa o seed (migrations rodam automáticas via synchronize: true)
#
# Uso:
#   ./migration-seed.sh     - Executa tudo em sequência
#
# ============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BRIGHT='\033[1m'
NC='\033[0m' # No Color

# Funções de log
print_header() {
    echo -e "\n${CYAN}${BRIGHT}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BRIGHT}  ${1}${NC}"
    echo -e "${CYAN}${BRIGHT}════════════════════════════════════════════════════════════${NC}\n"
}

print_section() {
    echo -e "\n${BLUE}${BRIGHT}▶ ${1}${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ ${1}${NC}"
}

print_warn() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

# Detectar a pasta correta
find_project_root() {
    # Se estamos na pasta do backend
    if [ -f "package.json" ] && [ -f "src/run-seed.ts" ]; then
        PROJECT_ROOT=".."
        return 0
    fi

    # Se estamos na raiz do projeto
    if [ -d "backend" ] && [ -d "frontend" ]; then
        PROJECT_ROOT="."
        return 0
    fi

    # Se estamos em alguma pasta intermediária
    if [ -d "../backend" ] && [ -d "../frontend" ]; then
        PROJECT_ROOT=".."
        return 0
    fi

    return 1
}

# ============================================================================
# INÍCIO DO SCRIPT
# ============================================================================

print_header "🌱 SEED - EXECUÇÃO COMPLETA (MIGRATIONS AUTOMÁTICAS)"

print_info "Detectando localização do projeto..."

# Encontrar raiz do projeto
if ! find_project_root; then
    print_error "Não consegui encontrar a estrutura do projeto!"
    print_info "Certifique-se de executar este script:"
    print_info "  • From: /backend ou /frontend ou /"
    print_info "  • Em um projeto com estrutura: /backend /frontend"
    exit 1
fi

print_success "Projeto encontrado em: $PROJECT_ROOT"

# ============================================================================
# ETAPA 1: Verificar docker-compose
# ============================================================================

print_section "Etapa 1: Verificando docker-compose"

if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose não encontrado!"
    print_info "Instale o Docker Desktop ou docker-compose"
    exit 1
fi

print_success "docker-compose disponível"

# ============================================================================
# ETAPA 2: Verificar se containers estão rodando
# ============================================================================

print_section "Etapa 2: Verificando status dos containers"

cd "$PROJECT_ROOT"

if ! docker-compose ps backend 2>/dev/null | grep -q "Up"; then
    print_error "Backend não está rodando!"
    print_info "Execute para iniciar: docker-compose up -d"
    exit 1
fi

print_success "Backend está rodando"

# ============================================================================
# ETAPA 3: Aguardar banco ficar pronto
# ============================================================================

print_section "Etapa 3: Aguardando banco de dados ficar pronto"

print_info "Testando conexão com o banco..."
RETRY_COUNT=0
MAX_RETRIES=15

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker-compose exec db pg_isready -U postgres &>/dev/null; then
        print_success "Banco de dados pronto!"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    print_info "Tentativa $RETRY_COUNT/$MAX_RETRIES... aguardando banco"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_warn "Banco pode ainda estar iniciando, continuando mesmo assim..."
fi

# ============================================================================
# ETAPA 4: Executar seed
# ============================================================================

print_section "Etapa 4: Executando seed (populando dados)"

print_info "Conectando ao container backend..."
print_info "As tabelas serão criadas automaticamente via TypeORM (synchronize: true)"
echo ""

# Rodar o seed
docker-compose exec backend npm run seed:verbose

FINAL_EXIT_CODE=$?

# ========================================
# ETAPA 5: Resumo
# ========================================

echo ""
print_section "Resumo final"

if [ $FINAL_EXIT_CODE -eq 0 ]; then
    print_success "SEED executado com SUCESSO!"
    echo ""
    print_info "Próximos passos:"
    echo -e "  ${BRIGHT}${CYAN}1. Abra seu frontend no navegador${NC}"
    echo -e "  ${BRIGHT}${CYAN}2. Faça login com:${NC}"
    echo ""
    echo -e "    ${GREEN}Email:${NC}  ${BRIGHT}admin@meusistema.com${NC}"
    echo -e "    ${GREEN}Senha:${NC}  ${BRIGHT}Senha@123${NC}"
    echo ""
    echo -e "  ${BRIGHT}${CYAN}3. Comece a usar o sistema! 🎉${NC}"
else
    print_error "Erro ao executar seed (código: $FINAL_EXIT_CODE)"
    print_info "Verifique os logs acima para mais detalhes"
fi

echo ""

exit $FINAL_EXIT_CODE
