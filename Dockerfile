FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Faz o build da aplicação (o Vite vai precisar da variável VITE_OPENAI_API_KEY aqui)
ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY

RUN npm run build

# Configura o servidor Nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
