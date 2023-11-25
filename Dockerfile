FROM node:21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:mainline-alpine

COPY docker-resources/nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]