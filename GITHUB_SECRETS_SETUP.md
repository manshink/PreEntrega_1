# 🔐 Configuración de Secretos de GitHub

Para que el despliegue automático funcione, necesitas configurar los siguientes secretos en tu repositorio de GitHub:

## Pasos para Configurar Secretos

### 1. Ir a la Configuración del Repositorio
1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**

### 2. Agregar los Secretos Requeridos

Haz clic en **New repository secret** y agrega:

#### `DOCKER_USERNAME`
- **Nombre:** `DOCKER_USERNAME`
- **Valor:** Tu nombre de usuario de Docker Hub
- **Ejemplo:** `mi-usuario-dockerhub`

#### `DOCKER_PASSWORD`
- **Nombre:** `DOCKER_PASSWORD`
- **Valor:** Tu contraseña de Docker Hub (o Access Token)
- **Ejemplo:** `mi-contraseña-segura`

> **Nota:** Para mayor seguridad, se recomienda usar un Access Token en lugar de la contraseña. Puedes crear uno en Docker Hub → Account Settings → Security → New Access Token.

### 3. Verificar la Configuración

Una vez configurados los secretos, cada vez que hagas push a la rama `main`, GitHub Actions automáticamente:
1. Construirá la imagen de Docker
2. La subirá a Docker Hub
3. La etiquetará con la versión correspondiente

### 4. Verificar el Despliegue

Puedes ver el progreso del despliegue en:
- **GitHub:** Tu repositorio → Actions
- **Docker Hub:** https://hub.docker.com/r/tu-usuario/pet-adoption-api

## Comandos de Verificación

```bash
# Verificar que la imagen está en Docker Hub
docker pull tu-usuario-dockerhub/pet-adoption-api:latest

# Ejecutar la imagen
docker run -p 8080:8080 tu-usuario-dockerhub/pet-adoption-api:latest
```

## Troubleshooting

### Error de Autenticación
- Verifica que los secretos estén configurados correctamente
- Asegúrate de que el nombre de usuario y contraseña sean correctos
- Si usas 2FA, usa un Access Token en lugar de la contraseña

### Error de Permisos
- Asegúrate de que tu cuenta de Docker Hub tenga permisos para crear repositorios
- Verifica que el nombre del repositorio no esté en uso

### Error de Build
- Revisa los logs en GitHub Actions
- Verifica que el Dockerfile esté en la raíz del proyecto
- Asegúrate de que todas las dependencias estén en package.json
