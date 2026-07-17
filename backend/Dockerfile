FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm install

COPY backend/ .
COPY database/ /app/database/
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
