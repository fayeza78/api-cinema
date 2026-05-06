# REVIEW

Bienvenue dans la documentation de l'API RESTful dédiée à la gestion d'un cinéma. Ce projet permet d'administrer l'infrastructure du cinéma (salles, films, séances) et d'offrir un système de billetterie complet pour les clients.

## Accès Rapides
- **Application en production :** [Insère ton lien ici]
- **Documentation Interactive (Swagger) :** [Insère le lien /api-docs ici]

---

## Fonctionnalités Développées

Cette API répond à l'ensemble des exigences du cahier des charges, réparties selon les rôles des utilisateurs (Client / Administrateur).

### 1. Sécurité et Authentification (JWT)
L'API est entièrement sécurisée grâce à l'utilisation de JSON Web Tokens (JWT).
- **Inscription & Connexion :** Création de compte sécurisée avec hachage des mots de passe.
- **Gestion des Rôles :** Séparation stricte entre les droits d'un `CLIENT` (achat, consultation) et d'un `ADMIN` (gestion du cinéma).
- **Profil Utilisateur :** Chaque utilisateur possède un portefeuille virtuel (solde) et un compteur de tickets (Super Billets).

### 2. Gestion du Cinéma (Espace Administrateur)
L'administrateur dispose de routes protégées pour modéliser le cinéma physique :
- **Gestion des Salles :** Création et configuration des salles avec des caractéristiques précises (Nom, Capacité, Description, Images, Type de salle ex: IMAX, Accès handicapé).
- **Gestion des Films :** Ajout de films au catalogue du cinéma.
- **Programmation des Séances :** Planification rigoureuse liant un Film, une Salle, une Heure de début (`startTime`) et une Heure de fin (`endTime`). 

### 3. Billetterie et E-commerce (Espace Client)
La logique métier principale se concentre sur l'achat et la gestion des places :
- **Achat de billet à l'unité :** Réservation d'une place pour une séance spécifique.
- **Achat du "Super Billet" (Carnet de places) :** 
  - Logique transactionnelle avancée : Le client peut acheter un pass de 10 places pour 100€.
  - *Sécurité transactionnelle* : Le débit du solde du client et l'incrémentation de ses 10 places s'effectuent via une transaction unifiée (`prisma.$transaction`). Si le client manque de fonds, l'opération est bloquée.

### 4. Documentation OpenAPI (Swagger)
Toutes les routes de l'API sont documentées et testables via une interface Swagger accessible publiquement, respectant les standards OpenAPI 3.0.

---

## Stack Technique
- **Serveur :** Node.js avec Express.js (TypeScript)
- **Base de données :** PostgreSQL (Conteneurisé via Docker)
- **ORM :** Prisma
- **Validation & Sécurité :** JWT pour l'authentification, gestion stricte des erreurs HTTP.

---

## Lancement en Local (Évaluation)

Si vous souhaitez évaluer l'application localement, voici la procédure :

1. **Cloner et installer :**
   docker compose up -d