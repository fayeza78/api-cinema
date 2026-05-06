FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/


RUN npm install


COPY . .


RUN npx prisma generate
RUN npm run build



FROM node:22-alpine AS production

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/


RUN npm install --omit=dev


COPY --from=builder /app/dist ./dist


RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src   
EXPOSE 3002                           
EXPOSE 3002


CMD ["node", "dist/index.js"]