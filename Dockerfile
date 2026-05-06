FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN npx prisma generate

EXPOSE 3002 

CMD sh -c "npx prisma db push && node dist/index.js"