FROM node:18-slim
WORKDIR /app/backend
COPY backend/package.json package.json
RUN npm install
COPY backend/ .
EXPOSE 3001
CMD ["node", "src/index.js"]
