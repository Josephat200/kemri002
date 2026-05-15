FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

# Build backend
RUN npm run build

# Build frontend and place the static output where the backend expects it
COPY frontend/package.json ./frontend/package.json
RUN npm install --prefix frontend
COPY frontend/ ./frontend/
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build --prefix frontend

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm install --omit=dev && mkdir -p logs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/dist /frontend

EXPOSE 3000

CMD ["npm", "start"]
