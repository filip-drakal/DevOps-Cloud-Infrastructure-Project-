FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . ./

FROM node:18-slim AS production
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "app.js"]
