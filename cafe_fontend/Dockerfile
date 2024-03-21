# Use the official Node image as a base image
FROM node:18.19.0 as builder

WORKDIR /app

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build:production

FROM nginx:1.24.0-alpine

COPY --from=builder /app/dist/cafe_fontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g", "daemon off;"]