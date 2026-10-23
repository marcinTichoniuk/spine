FROM node:24.19.0-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.ts ./
CMD ["node", "server.ts"]
