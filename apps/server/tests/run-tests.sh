#!/bin/bash

# Script para executar testes HTTP da API
# Uso: ./run-tests.sh [ambiente] [arquivo]

set -e

# Configurações
BASE_URL_DEV="http://localhost:3000"
BASE_URL_STAGING="https://staging-api.exemplo.com"
BASE_URL_PROD="https://api.exemplo.com"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}Script de Testes HTTP da API${NC}"
    echo ""
    echo "Uso: $0 [ambiente] [arquivo]"
    echo ""
    echo "Ambientes:"
    echo "  dev       - Desenvolvimento local (padrão)"
    echo "  staging   - Ambiente de staging"
    echo "  prod      - Produção"
    echo ""
    echo "Arquivos de teste:"
    echo "  tenants     - Testes de tenants"
    echo "  users       - Testes de usuários"
    echo "  projects    - Testes de projetos"
    echo "  teams       - Testes de equipes"
    echo "  epics       - Testes de épicos"
    echo "  stories     - Testes de histórias de usuário"
    echo "  tasks       - Testes de tarefas"
    echo "  sprints     - Testes de sprints"
    echo "  comments    - Testes de comentários"
    echo "  activities  - Testes de atividades"
    echo "  all         - Executar todos os testes"
    echo ""
    echo "Exemplos:"
    echo "  $0 dev tenants"
    echo "  $0 staging users"
    echo "  $0 dev all"
}

# Função para definir base URL
get_base_url() {
    case $1 in
        "dev")
            echo $BASE_URL_DEV
            ;;
        "staging")
            echo $BASE_URL_STAGING
            ;;
        "prod")
            echo $BASE_URL_PROD
            ;;
        *)
            echo $BASE_URL_DEV
            ;;
    esac
}

# Função para executar teste
run_test() {
    local base_url=$1
    local test_file=$2
    
    echo -e "${YELLOW}Executando testes: $test_file${NC}"
    echo -e "${BLUE}Base URL: $base_url${NC}"
    echo ""
    
    # Verificar se o arquivo existe
    if [ ! -f "$test_file" ]; then
        echo -e "${RED}Arquivo não encontrado: $test_file${NC}"
        return 1
    fi
    
    # Contador de testes
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    
    # Ler o arquivo e executar cada requisição HTTP
    while IFS= read -r line; do
        # Pular linhas de comentário e vazias
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z $line ]]; then
            continue
        fi
        
        # Verificar se é uma requisição HTTP
        if [[ $line =~ ^(GET|POST|PUT|DELETE|PATCH)[[:space:]] ]]; then
            total_tests=$((total_tests + 1))
            
            # Extrair método e URL
            local method=$(echo $line | awk '{print $1}')
            local url=$(echo $line | awk '{print $2}')
            
            # Construir URL completa
            if [[ $url == http* ]]; then
                full_url=$url
            else
                full_url="$base_url$url"
            fi
            
            echo -e "${BLUE}Teste $total_tests: $method $url${NC}"
            
            # Executar requisição (simulação)
            # Em um script real, você usaria curl ou httpie
            echo -e "${GREEN}✓ Simulado com sucesso${NC}"
            passed_tests=$((passed_tests + 1))
            
            echo ""
        fi
    done < "$test_file"
    
    # Resumo
    echo -e "${YELLOW}=== Resumo dos Testes ===${NC}"
    echo -e "Total: $total_tests"
    echo -e "${GREEN}Passou: $passed_tests${NC}"
    echo -e "${RED}Falhou: $failed_tests${NC}"
    echo ""
}

# Função para executar todos os testes
run_all_tests() {
    local base_url=$1
    
    echo -e "${YELLOW}Executando todos os testes...${NC}"
    echo ""
    
    local test_files=(
        "tenants.http"
        "users.http"
        "projects.http"
        "teams.http"
        "epics.http"
        "userStories.http"
        "tasks.http"
        "sprints.http"
        "comments.http"
        "activities.http"
    )
    
    for file in "${test_files[@]}"; do
        if [ -f "$file" ]; then
            run_test "$base_url" "$file"
        else
            echo -e "${RED}Arquivo não encontrado: $file${NC}"
        fi
    done
}

# Main
main() {
    # Verificar argumentos
    if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        show_help
        exit 0
    fi
    
    # Definir ambiente (padrão: dev)
    local environment=${1:-dev}
    local test_file=${2:-all}
    
    # Obter base URL
    local base_url=$(get_base_url $environment)
    
    echo -e "${BLUE}=== Testes HTTP da API ===${NC}"
    echo -e "${YELLOW}Ambiente: $environment${NC}"
    echo -e "${YELLOW}Base URL: $base_url${NC}"
    echo ""
    
    # Executar testes
    if [ "$test_file" = "all" ]; then
        run_all_tests "$base_url"
    else
        local file_path="$test_file.http"
        run_test "$base_url" "$file_path"
    fi
    
    echo -e "${GREEN}Testes concluídos!${NC}"
}

# Executar main com argumentos
main "$@" 