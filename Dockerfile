# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Crear directorio para logs
RUN mkdir -p logs

# Exponer el puerto 8080
EXPOSE 8080

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar la propiedad de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Comando para iniciar la aplicación
CMD ["npm", "start"]

