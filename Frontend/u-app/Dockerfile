# Usa la imagen oficial de Node.js
FROM node:22.12

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código del frontend
COPY . .

# Expone el puerto 3000 para el frontend
EXPOSE 3000

# Ejecuta el frontend en modo desarrollo
CMD ["npm", "run", "dev"]
