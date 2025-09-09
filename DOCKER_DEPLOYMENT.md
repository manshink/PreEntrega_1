# 🐳 Guía de Despliegue con Docker

## Prerrequisitos

1. **Instalar Docker Desktop**
   - Descargar desde: https://www.docker.com/products/docker-desktop/
   - Instalar y reiniciar el sistema
   - Verificar instalación: `docker --version`

2. **Crear cuenta en Docker Hub**
   - Registrarse en: https://hub.docker.com/
   - Anotar tu nombre de usuario

## Pasos para Desplegar

### 1. Construir la Imagen Localmente

```bash
# Construir la imagen
docker build -t pet-adoption-api .

# Verificar que se construyó correctamente
docker images | grep pet-adoption-api
```

### 2. Probar la Imagen Localmente

```bash
# Ejecutar con MongoDB externo
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/pet-adoption-db pet-adoption-api

# O usar Docker Compose (recomendado)
docker-compose up -d
```

### 3. Subir a Docker Hub

```bash
# Etiquetar la imagen con tu usuario
docker tag pet-adoption-api tu-usuario-dockerhub/pet-adoption-api:latest

# Iniciar sesión en Docker Hub
docker login

# Subir la imagen
docker push tu-usuario-dockerhub/pet-adoption-api:latest
```

### 4. Usar el Script Automatizado

```bash
# Hacer ejecutable (Linux/Mac)
chmod +x deploy-docker.sh

# Ejecutar el script
./deploy-docker.sh tu-usuario-dockerhub
```

## Verificación

Una vez subida la imagen, puedes verificar que funciona:

```bash
# Descargar y ejecutar desde Docker Hub
docker run -p 8080:8080 tu-usuario-dockerhub/pet-adoption-api:latest
```

## Enlaces Importantes

- **Docker Hub:** https://hub.docker.com/r/tu-usuario-dockerhub/pet-adoption-api
- **Documentación API:** http://localhost:8080/api-docs
- **Health Check:** http://localhost:8080/health

## Comandos Útiles

```bash
# Ver logs del contenedor
docker logs <container-id>

# Detener contenedor
docker stop <container-id>

# Eliminar imagen
docker rmi pet-adoption-api

# Limpiar sistema Docker
docker system prune -a
```
