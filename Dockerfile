# --- ÉTAPE 1 : BUILDER (Compilation du code) ---
FROM node:22-alpine AS builder

WORKDIR /app

# Installation de OpenSSL (Requis par Prisma sur Alpine)
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


# --- ÉTAPE 2 : PRODUCTION (Image finale allégée) ---
FROM node:22-alpine AS production

WORKDIR /app

# Installation de OpenSSL pour l'exécution en production
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# On installe UNIQUEMENT les dépendances de production (ça allège l'image)
RUN npm install --omit=dev

# On récupère le code compilé depuis l'étape 1
COPY --from=builder /app/dist ./dist

# On génère le client Prisma pour la production
RUN npx prisma generate

# On expose le port de l'API
EXPOSE 3002 

# Commande de démarrage
CMD ["node", "dist/index.js"]