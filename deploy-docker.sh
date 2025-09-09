#!/bin/bash

# Script para construir y subir la imagen a Docker Hub
# Uso: ./deploy-docker.sh [tu-usuario-dockerhub]

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar tu usuario de Docker Hub"
    echo "Uso: ./deploy-docker.sh tu-usuario-dockerhub"
    exit 1
fi

DOCKER_USERNAME=$1
IMAGE_NAME="pet-adoption-api"
TAG="latest"

echo "🐳 Construyendo imagen de Docker..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente"
    
    echo "🔐 Iniciando sesión en Docker Hub..."
    docker login
    
    if [ $? -eq 0 ]; then
        echo "📤 Subiendo imagen a Docker Hub..."
        docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG
        
        if [ $? -eq 0 ]; then
            echo "🎉 ¡Imagen subida exitosamente a Docker Hub!"
            echo "📍 URL: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
            echo ""
            echo "Para usar la imagen:"
            echo "docker run -p 8080:8080 $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
        else
            echo "❌ Error al subir la imagen"
            exit 1
        fi
    else
        echo "❌ Error al iniciar sesión en Docker Hub"
        exit 1
    fi
else
    echo "❌ Error al construir la imagen"
    exit 1
fi

