FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend/ ./

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm ci --omit=dev && mkdir -p logs

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
