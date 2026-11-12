FROM node:22-alpine AS build
WORKDIR /app

COPY server/package*.json ./server/
RUN npm ci --prefix server --omit=dev

COPY client/package*.json ./client/
RUN npm ci --prefix client
COPY client ./client
RUN npm run build --prefix client

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=5000
WORKDIR /app
COPY --from=build /app/server ./server
COPY --from=build /app/public ./public
COPY server/src ./server/src
COPY server/.env.example ./server/.env.example
RUN mkdir -p /app/server/uploads && chown -R node:node /app/server/uploads
EXPOSE 5000
USER node
CMD ["node", "server/src/server.js"]
