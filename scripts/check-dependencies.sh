#!/bin/bash
set -e

# Detect language from environment or system locale
detect_language() {
    # Check for explicit LANG env var
    if [[ "${LANG:-}" == *"pt"* ]] || [[ "${LANGUAGE:-}" == *"pt"* ]]; then
        echo "pt"
    elif [[ "${LC_ALL:-}" == *"pt"* ]] || [[ "${LC_MESSAGES:-}" == *"pt"* ]]; then
        echo "pt"
    else
        echo "en"
    fi
}

LANG=$(detect_language)

# Messages in both languages
if [[ "$LANG" == "pt" ]]; then
    MSG_CHECKING="🔍 Verificando dependências do Trello CLI Unofficial..."
    MSG_BUN_FOUND="✅ Bun encontrado:"
    MSG_BUN_NOT_FOUND="❌ Bun NÃO encontrado!"
    MSG_BUN_REQUIRED="📦 O Trello CLI Unofficial requer Bun para funcionar corretamente."
    MSG_BUN_BENEFIT="   Bun oferece performance 10-50x superior ao Node.js para este projeto."
    MSG_INSTALL_PROMPT="🔧 Deseja instalar o Bun agora? (Y/n): "
    MSG_INSTALLING="🚀 Instalando Bun..."
    MSG_INSTALL_SUCCESS="✅ Bun instalado com sucesso!"
    MSG_VERSION="   Versão:"
    MSG_INSTALL_FAILED="❌ Falha ao instalar Bun. Verifique sua conexão e tente novamente."
    MSG_CANCELLED="❌ Instalação cancelada."
    MSG_MANUAL_INSTALL="💡 Para instalar manualmente:"
    MSG_MANUAL_COMMAND="   curl -fsSL https://bun.sh/install | bash"
    MSG_RETRY="🔄 Depois execute: npm install -g trello-cli-unofficial"
    MSG_SUCCESS="🎉 Todas as dependências verificadas com sucesso!"
else
    MSG_CHECKING="🔍 Checking Trello CLI Unofficial dependencies..."
    MSG_BUN_FOUND="✅ Bun found:"
    MSG_BUN_NOT_FOUND="❌ Bun NOT found!"
    MSG_BUN_REQUIRED="📦 Trello CLI Unofficial requires Bun to work correctly."
    MSG_BUN_BENEFIT="   Bun offers 10-50x better performance than Node.js for this project."
    MSG_INSTALL_PROMPT="🔧 Do you want to install Bun now? (Y/n): "
    MSG_INSTALLING="🚀 Installing Bun..."
    MSG_INSTALL_SUCCESS="✅ Bun installed successfully!"
    MSG_VERSION="   Version:"
    MSG_INSTALL_FAILED="❌ Failed to install Bun. Check your connection and try again."
    MSG_CANCELLED="❌ Installation cancelled."
    MSG_MANUAL_INSTALL="💡 To install manually:"
    MSG_MANUAL_COMMAND="   curl -fsSL https://bun.sh/install | bash"
    MSG_RETRY="🔄 Then run: npm install -g trello-cli-unofficial"
    MSG_SUCCESS="🎉 All dependencies checked successfully!"
fi

echo "$MSG_CHECKING"
echo ""

# Check if Bun is installed
if command -v bun &> /dev/null; then
    echo "$MSG_BUN_FOUND $(bun --version)"
else
    echo "$MSG_BUN_NOT_FOUND"
    echo ""
    echo "$MSG_BUN_REQUIRED"
    echo "$MSG_BUN_BENEFIT"
    echo ""
    
    # Read user input with timeout and default
    read -p "$MSG_INSTALL_PROMPT" -n 1 -r -t 30 REPLY || REPLY="y"
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        echo "$MSG_INSTALLING"
        if curl -fsSL https://bun.sh/install | bash; then
            # Add Bun to PATH for current session
            export PATH="$HOME/.bun/bin:$PATH"
            
            if command -v bun &> /dev/null; then
                echo "$MSG_INSTALL_SUCCESS"
                echo "$MSG_VERSION $(bun --version)"
            else
                echo "$MSG_INSTALL_FAILED"
                exit 1
            fi
        else
            echo "$MSG_INSTALL_FAILED"
            exit 1
        fi
    else
        echo "$MSG_CANCELLED"
        echo ""
        echo "$MSG_MANUAL_INSTALL"
        echo "$MSG_MANUAL_COMMAND"
        echo ""
        echo "$MSG_RETRY"
        exit 1
    fi
fi

echo ""
echo "$MSG_SUCCESS"
