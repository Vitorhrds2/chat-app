#!/bin/bash

# Script para instalar o docker-compose
set -e

# Verifique se o script está sendo executado com permissões suficientes
if [ "$(id -u)" -ne 0 ]; then
  echo "Este script precisa de permissões de superusuário para instalar o docker-compose."
  exit 1
fi

# Verifique se o docker-compose já está instalado
if command -v docker-compose &> /dev/null; then
  echo "docker-compose já está instalado."
  exit 0
fi

# Instale o docker-compose
echo "Instalando docker-compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
echo "docker-compose instalado com sucesso."

# Verifique a instalação
docker-compose --version
