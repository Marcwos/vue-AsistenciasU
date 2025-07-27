# Etapa 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copia dependencias y proyecto
COPY package*.json ./
RUN npm install

COPY . .

# Compila la app Vue
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine

# Elimina la configuración default y copia la nueva
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
