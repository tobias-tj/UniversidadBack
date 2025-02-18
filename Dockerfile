# Usa una imagen base con Node.js
FROM node:20

# Configura el directorio de trabajo
WORKDIR /app

# Instala dependencias necesarias (Python, Make, g++, Java)
RUN apt-get update && apt-get install -y python3 make g++ openjdk-17-jdk

# Define la variable de entorno para Java
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Copia los archivos de dependencia primero
COPY package.json package-lock.json* ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]
