FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Instala Nest CLI globalmente
RUN npm install -g @nestjs/cli

EXPOSE 3000

CMD ["sh", "-c", "npm run start:dev"]