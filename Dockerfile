FROM node:21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:mainline-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# set port to 8000
EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]