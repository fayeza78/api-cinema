# REVIEW

Bienvenue dans la documentation de l'API RESTful dédiée à la gestion d'un cinéma. Ce projet permet d'administrer l'infrastructure du cinéma (salles, films, séances) et d'offrir un système de billetterie complet pour les clients.

## Accès Rapides

- **Application en production :** [Insère ton lien ici]
- **Documentation Interactive (Swagger) :** https://api-cinema-production.onrender.com/api-docs/

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
  - _Sécurité transactionnelle_ : Le débit du solde du client et l'incrémentation de ses 10 places s'effectuent via une transaction unifiée (`prisma.$transaction`). Si le client manque de fonds, l'opération est bloquée.

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
   docker compose up --build
2. **Voir la base de données :** npx prisma studio puis http://localhost:5555
3. **Lien vers le front :** http://localhost:3002
4. **Lien vers le Swagger :** http://localhost:3002/api-docs

---

## Variable d'environnement

Le projet utilise un fichier `.env` pour configurer la connexion à la base de données et les secrets JWT.

Crée un fichier `.env` à la racine du projet avec les variables suivantes :

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"
```

---

## Rôles et Permissions

L'API utilise un système de rôles afin de limiter l'accès aux différentes fonctionnalités selon le type d'utilisateur.
Certaines routes sont accessibles à tous les utilisateurs authentifiés, tandis que les routes de gestion sont réservées aux administrateurs.

---

## Client

Le rôle `CLIENT` correspond à un utilisateur classique du cinéma.

Un client peut :

- créer un compte ;
- se connecter et se déconnecter ;
- consulter les films disponibles ;
- consulter les séances du cinéma ;
<!-- - consulter le planning d’un film sur une période choisie ;
- consulter le planning d’une salle sur une période choisie ; -->
- ajouter de l’argent sur son compte
- retirer de l’argent de son compte
- consulter son solde
- consulter l’historique de ses transactions
- acheter un billet pour une séance
- acheter un Super Billet donnant accès à 10 séances
- consulter ses billets
- voir quels billets ont déjà été utilisés et pour quelles séances

### Administrateur

Le rôle `ADMIN` correspond à un utilisateur ayant accès à la gestion du cinéma.

Un administrateur peut :

- accéder à toutes les fonctionnalités d’un client
- créer, modifier et supprimer des salles
- mettre une salle en maintenance
- créer, modifier et supprimer des films
- créer, modifier et supprimer des séances
<!-- - vérifier le nombre de billets vendus pour une séance  -->
- consulter les utilisateurs de l’API
- consulter les informations détaillées d’un utilisateur
- consulter les transactions des clients
- consulter les statistiques de fréquentation du cinéma

---

## Principales Routes de l’API

Cette section présente les principales routes disponibles dans l’API REVIEW.  
Les routes protégées nécessitent un token JWT envoyé dans le header `Authorization`.

### Authentification

Les routes d’authentification permettent de gérer l’inscription, la connexion, la récupération du profil utilisateur et la déconnexion.

#### Inscription

| Méthode | URL                  | Accès  |
| ------- | -------------------- | ------ |
| `POST`  | `/api/auth/register` | Public |

Permet de créer un nouveau compte utilisateur.

| Champ      | Type     | Obligatoire | Description                    |
| ---------- | -------- | ----------- | ------------------------------ |
| `email`    | `string` | Oui         | Adresse email de l’utilisateur |
| `password` | `string` | Oui         | Mot de passe de l’utilisateur  |

**Réponse :** retourne un message de confirmation ainsi que les informations principales de l’utilisateur créé.

| Code  | Description                  |
| ----- | ---------------------------- |
| `201` | Utilisateur créé avec succès |
| `400` | Email et mot de passe requis |
| `409` | Email déjà utilisé           |
| `500` | Erreur interne du serveur    |

---

#### Connexion

| Méthode | URL               | Accès  |
| ------- | ----------------- | ------ |
| `POST`  | `/api/auth/login` | Public |

Permet à un utilisateur de se connecter avec son email et son mot de passe.

| Champ      | Type     | Obligatoire | Description                    |
| ---------- | -------- | ----------- | ------------------------------ |
| `email`    | `string` | Oui         | Adresse email de l’utilisateur |
| `password` | `string` | Oui         | Mot de passe de l’utilisateur  |

**Réponse :** retourne les tokens d’authentification ainsi que les informations de l’utilisateur connecté.

| Code  | Description            |
| ----- | ---------------------- |
| `200` | Connexion réussie      |
| `401` | Identifiants invalides |

---

#### Profil utilisateur connecté

| Méthode | URL            | Accès                   |
| ------- | -------------- | ----------------------- |
| `GET`   | `/api/auth/me` | Utilisateur authentifié |

Permet de récupérer les informations complètes du profil connecté.

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

Le profil contient notamment :

- l’identifiant de l’utilisateur ;
- son email ;
- son rôle ;
- son solde ;
- son nombre de Super Billets ;
- son historique de transactions ;
- ses billets achetés ;
- les informations des séances associées aux billets.

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `200` | Profil récupéré avec succès              |
| `401` | Token manquant ou expiré                 |
| `404` | Utilisateur introuvable                  |
| `500` | Erreur lors de la récupération du profil |

---

#### Déconnexion

| Méthode | URL                | Accès                   |
| ------- | ------------------ | ----------------------- |
| `POST`  | `/api/auth/logout` | Utilisateur authentifié |

Permet de déconnecter l’utilisateur en révoquant son refresh token.

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ          | Type     | Obligatoire | Description              |
| -------------- | -------- | ----------- | ------------------------ |
| `refreshToken` | `string` | Oui         | Refresh token à révoquer |

| Code  | Description                   |
| ----- | ----------------------------- |
| `200` | Déconnexion réussie           |
| `400` | Refresh token manquant        |
| `401` | Token manquant ou expiré      |
| `500` | Erreur lors de la déconnexion |

---

### Statistiques Administrateur

Les routes d’administration sont réservées aux utilisateurs ayant le rôle `ADMIN`.

#### Tableau de bord administrateur

| Méthode | URL                | Accès          |
| ------- | ------------------ | -------------- |
| `GET`   | `/api/admin/stats` | Administrateur |

Permet de récupérer les statistiques générales du cinéma.

**Middlewares utilisés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

Les statistiques retournées contiennent notamment :

| Champ                  | Type     | Description                       |
| ---------------------- | -------- | --------------------------------- |
| `clientsInscrits`      | `number` | Nombre total de clients inscrits  |
| `billetsVendus`        | `number` | Nombre total de billets vendus    |
| `chiffreAffairesEuros` | `number` | Chiffre d’affaires total en euros |

| Code  | Description                                             |
| ----- | ------------------------------------------------------- |
| `200` | Statistiques récupérées avec succès                     |
| `401` | Token manquant ou expiré                                |
| `403` | Accès refusé, rôle admin requis                         |
| `500` | Erreur serveur lors de la récupération des statistiques |

---

### Statistiques

Les routes de statistiques permettent à un administrateur de consulter les indicateurs principaux du cinéma depuis un tableau de bord.

#### Tableau de bord administrateur

| Méthode | URL                | Accès          |
| ------- | ------------------ | -------------- |
| `GET`   | `/api/admin/stats` | Administrateur |

Permet de récupérer les statistiques générales de l’application REVIEW.

Cette route est protégée et accessible uniquement aux utilisateurs ayant le rôle `ADMIN`.

**Middlewares utilisés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

**Réponse :** retourne un message ainsi qu’un objet contenant les statistiques du cinéma.

| Champ                        | Type     | Description                                |
| ---------------------------- | -------- | ------------------------------------------ |
| `message`                    | `string` | Message du tableau de bord                 |
| `stats`                      | `object` | Objet contenant les statistiques générales |
| `stats.clientsInscrits`      | `number` | Nombre total de clients inscrits           |
| `stats.billetsVendus`        | `number` | Nombre total de billets vendus             |
| `stats.chiffreAffairesEuros` | `number` | Chiffre d’affaires total en euros          |

| Code  | Description                                             |
| ----- | ------------------------------------------------------- |
| `200` | Statistiques récupérées avec succès                     |
| `401` | Token manquant ou expiré                                |
| `403` | Accès refusé, rôle admin requis                         |
| `500` | Erreur serveur lors de la récupération des statistiques |

---

## Films

Les routes liées aux films permettent de consulter le catalogue du cinéma et de gérer les films disponibles.  
La consultation est accessible aux utilisateurs, tandis que la création, la modification et la suppression sont réservées aux administrateurs.

#### Liste des films

| Méthode | URL           | Accès                             |
| ------- | ------------- | --------------------------------- |
| `GET`   | `/api/movies` | Public ou utilisateur authentifié |

Permet de récupérer la liste complète des films enregistrés dans le catalogue.

**Réponse :** retourne un tableau contenant les films disponibles.

| Champ         | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `id`          | `number` | Identifiant du film                |
| `titre`       | `string` | Titre du film                      |
| `description` | `string` | Description du film                |
| `duree`       | `number` | Durée du film en minutes           |
| `affiche`     | `string` | URL ou chemin de l’affiche du film |

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `200` | Films récupérés avec succès              |
| `500` | Erreur lors de la récupération des films |

---

#### Création d’un film

| Méthode | URL           | Accès          |
| ------- | ------------- | -------------- |
| `POST`  | `/api/movies` | Administrateur |

Permet à un administrateur d’ajouter un nouveau film au catalogue.

**Middlewares recommandés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ         | Type     | Obligatoire | Description                        |
| ------------- | -------- | ----------- | ---------------------------------- |
| `titre`       | `string` | Oui         | Titre du film                      |
| `description` | `string` | Non         | Description du film                |
| `duree`       | `number` | Oui         | Durée du film en minutes           |
| `affiche`     | `string` | Oui         | URL ou chemin de l’affiche du film |

**Réponse :** retourne un message de confirmation ainsi que le film créé.

| Code  | Description                                       |
| ----- | ------------------------------------------------- |
| `201` | Film ajouté avec succès                           |
| `400` | Le titre, la durée et l’affiche sont obligatoires |
| `500` | Erreur lors de la création du film                |

---

#### Modification d’un film

| Méthode | URL               | Accès          |
| ------- | ----------------- | -------------- |
| `PUT`   | `/api/movies/:id` | Administrateur |

Permet à un administrateur de modifier les informations d’un film existant.

**Middlewares recommandés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Paramètre | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `id`      | `number` | Identifiant du film à modifier |

| Champ         | Type     | Obligatoire | Description                       |
| ------------- | -------- | ----------- | --------------------------------- |
| `titre`       | `string` | Non         | Nouveau titre du film             |
| `description` | `string` | Non         | Nouvelle description du film      |
| `duree`       | `number` | Non         | Nouvelle durée du film en minutes |
| `affiche`     | `string` | Non         | Nouvelle affiche du film          |

**Réponse :** retourne un message de confirmation ainsi que le film mis à jour.

| Code  | Description                                                |
| ----- | ---------------------------------------------------------- |
| `200` | Film mis à jour                                            |
| `500` | Erreur lors de la modification du film ou film introuvable |

---

#### Suppression d’un film

| Méthode  | URL               | Accès          |
| -------- | ----------------- | -------------- |
| `DELETE` | `/api/movies/:id` | Administrateur |

Permet à un administrateur de supprimer un film du catalogue.

**Middlewares recommandés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Paramètre | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `id`      | `number` | Identifiant du film à supprimer |

| Code  | Description                                               |
| ----- | --------------------------------------------------------- |
| `200` | Film supprimé avec succès                                 |
| `500` | Erreur lors de la suppression du film ou film introuvable |

---

## Salles

Les routes liées aux salles permettent de consulter les salles disponibles dans le cinéma et de créer de nouvelles salles.  
Certaines routes sont publiques, tandis que les routes de création ou de génération nécessitent une authentification.

#### Liste des salles

| Méthode | URL          | Accès  |
| ------- | ------------ | ------ |
| `GET`   | `/api/rooms` | Public |

Permet de récupérer la liste complète des salles de cinéma enregistrées dans la base de données.

**Réponse :** retourne un tableau contenant les salles disponibles.

| Champ             | Type      | Description                                                               |
| ----------------- | --------- | ------------------------------------------------------------------------- |
| `id`              | `number`  | Identifiant de la salle                                                   |
| `nom`             | `string`  | Nom de la salle                                                           |
| `description`     | `string`  | Description de la salle                                                   |
| `images`          | `string`  | Liste d’images de la salle stockée sous forme de chaîne                   |
| `type`            | `string`  | Type de salle, par exemple `Classique`, `3D`, `IMAX`                      |
| `capacite`        | `number`  | Nombre de places disponibles dans la salle                                |
| `acces_handicape` | `boolean` | Indique si la salle est accessible aux personnes en situation de handicap |
| `en_maintenance`  | `boolean` | Indique si la salle est actuellement en maintenance                       |

| Code  | Description                            |
| ----- | -------------------------------------- |
| `200` | Liste des salles récupérée avec succès |
| `500` | Erreur serveur                         |

---

#### Génération automatique des salles

| Méthode | URL               | Accès                   |
| ------- | ----------------- | ----------------------- |
| `POST`  | `/api/rooms/seed` | Utilisateur authentifié |

Permet de générer automatiquement 10 salles de cinéma par défaut.  
Les salles créées possèdent des capacités aléatoires comprises entre 15 et 30 places.

Cette route échoue si des salles existent déjà dans la base de données.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

**Réponse :** retourne un message de confirmation ainsi que la liste des salles créées.

| Champ                | Type     | Description                               |
| -------------------- | -------- | ----------------------------------------- |
| `message`            | `string` | Message confirmant la création des salles |
| `salles`             | `array`  | Liste des salles générées                 |
| `salles.nom`         | `string` | Nom de la salle générée                   |
| `salles.description` | `string` | Description de la salle générée           |
| `salles.images`      | `string` | Images associées à la salle               |
| `salles.type`        | `string` | Type de salle                             |
| `salles.capacite`    | `number` | Capacité de la salle                      |

| Code  | Description                                      |
| ----- | ------------------------------------------------ |
| `201` | Les 10 salles ont été créées avec succès         |
| `400` | Les salles existent déjà dans la base de données |
| `401` | Token manquant ou expiré                         |
| `500` | Erreur lors de la génération des salles          |

---

#### Création d’une salle

| Méthode | URL          | Accès                   |
| ------- | ------------ | ----------------------- |
| `POST`  | `/api/rooms` | Utilisateur authentifié |

Permet de créer une nouvelle salle de cinéma.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ             | Type      | Obligatoire | Description                                                               |
| ----------------- | --------- | ----------- | ------------------------------------------------------------------------- |
| `nom`             | `string`  | Oui         | Nom de la salle                                                           |
| `description`     | `string`  | Oui         | Description de la salle                                                   |
| `images`          | `string`  | Oui         | Liste d’images de la salle stockée sous forme de chaîne                   |
| `type`            | `string`  | Oui         | Type de salle, par exemple `Classique`, `3D`, `IMAX`                      |
| `capacite`        | `number`  | Oui         | Capacité de la salle, comprise entre 15 et 30 places                      |
| `acces_handicape` | `boolean` | Non         | Indique si la salle est accessible aux personnes en situation de handicap |
| `en_maintenance`  | `boolean` | Non         | Indique si la salle est en maintenance                                    |

**Réponse :** retourne un message de confirmation ainsi que la salle créée.

| Champ                  | Type      | Description                          |
| ---------------------- | --------- | ------------------------------------ |
| `message`              | `string`  | Confirme la création de la salle     |
| `room.id`              | `number`  | Identifiant de la salle créée        |
| `room.nom`             | `string`  | Nom de la salle                      |
| `room.description`     | `string`  | Description de la salle              |
| `room.images`          | `string`  | Images associées à la salle          |
| `room.type`            | `string`  | Type de salle                        |
| `room.capacite`        | `number`  | Capacité de la salle                 |
| `room.acces_handicape` | `boolean` | Accessibilité handicapée de la salle |
| `room.en_maintenance`  | `boolean` | État de maintenance de la salle      |

| Code  | Description                                        |
| ----- | -------------------------------------------------- |
| `201` | Salle créée avec succès                            |
| `400` | Champs obligatoires manquants ou capacité invalide |
| `401` | Token manquant ou expiré                           |
| `500` | Erreur interne du serveur                          |

---

## Séances

Les routes liées aux séances permettent de consulter le planning du cinéma et de planifier de nouvelles séances.  
La création d’une séance est réservée aux administrateurs, tandis que la consultation est accessible aux utilisateurs authentifiés.

#### Création d’une séance

| Méthode | URL             | Accès          |
| ------- | --------------- | -------------- |
| `POST`  | `/api/sessions` | Administrateur |

Permet de planifier une séance pour un film dans une salle donnée.

Une séance est définie par :

- un film ;
- une salle ;
- une heure de début ;
- une heure de fin calculée automatiquement selon la durée du film.

Le cinéma est ouvert uniquement en semaine entre `09h00` et `20h00`.

**Middlewares utilisés :**

- `authenticate`
- `isAdmin`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ       | Type     | Obligatoire | Description                                             |
| ----------- | -------- | ----------- | ------------------------------------------------------- |
| `movieId`   | `number` | Oui         | Identifiant du film à programmer                        |
| `roomId`    | `number` | Oui         | Identifiant de la salle utilisée                        |
| `startTime` | `string` | Oui         | Date et heure de début de la séance au format date-time |

**Réponse :** retourne un message de confirmation ainsi que la séance créée.

| Champ               | Type     | Description                            |
| ------------------- | -------- | -------------------------------------- |
| `message`           | `string` | Confirme la planification de la séance |
| `session.id`        | `number` | Identifiant de la séance               |
| `session.movieId`   | `number` | Identifiant du film                    |
| `session.roomId`    | `number` | Identifiant de la salle                |
| `session.startTime` | `string` | Date et heure de début de la séance    |
| `session.endTime`   | `string` | Date et heure de fin de la séance      |

| Code  | Description                                                                       |
| ----- | --------------------------------------------------------------------------------- |
| `201` | Séance planifiée avec succès                                                      |
| `400` | Champs manquants, horaire invalide, cinéma fermé le week-end ou conflit d’horaire |
| `401` | Token manquant ou expiré                                                          |
| `403` | Accès refusé, rôle admin requis                                                   |
| `404` | Film introuvable                                                                  |
| `500` | Erreur lors de la création de la séance                                           |

---

#### Liste des séances

| Méthode | URL             | Accès                   |
| ------- | --------------- | ----------------------- |
| `GET`   | `/api/sessions` | Utilisateur authentifié |

Permet de récupérer la liste des séances disponibles.  
Les séances retournées concernent uniquement les salles qui ne sont pas en maintenance.

La route peut être filtrée par film et par plage de dates.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

##### Paramètres de requête

| Paramètre   | Type      | Obligatoire | Description                                |
| ----------- | --------- | ----------- | ------------------------------------------ |
| `movieId`   | `integer` | Non         | Filtre les séances par identifiant de film |
| `startDate` | `string`  | Non         | Date de début de la plage de recherche     |
| `endDate`   | `string`  | Non         | Date de fin de la plage de recherche       |

**Exemple d’URL avec filtres :**

`GET /api/sessions?movieId=1&startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.000Z`

**Réponse :** retourne un tableau de séances avec les informations du film et de la salle associés.

| Champ           | Type     | Description                         |
| --------------- | -------- | ----------------------------------- |
| `id`            | `number` | Identifiant de la séance            |
| `movieId`       | `number` | Identifiant du film                 |
| `roomId`        | `number` | Identifiant de la salle             |
| `startTime`     | `string` | Date et heure de début de la séance |
| `endTime`       | `string` | Date et heure de fin de la séance   |
| `movie.id`      | `number` | Identifiant du film                 |
| `movie.titre`   | `string` | Titre du film                       |
| `movie.duree`   | `number` | Durée du film en minutes            |
| `room.id`       | `number` | Identifiant de la salle             |
| `room.nom`      | `string` | Nom de la salle                     |
| `room.capacite` | `number` | Capacité de la salle                |

Pour un administrateur, la réponse peut également inclure le nombre de billets vendus pour chaque séance.

| Code  | Description                                |
| ----- | ------------------------------------------ |
| `200` | Liste des séances récupérée avec succès    |
| `401` | Token manquant ou expiré                   |
| `500` | Erreur lors de la récupération du planning |

---

## Billetterie

Les routes de billetterie permettent aux clients d’acheter des billets pour les séances et d’acheter un Super Billet, correspondant à un carnet de 10 places.

Toutes les routes de billetterie nécessitent une authentification.

#### Achat d’un billet

| Méthode | URL                | Accès                   |
| ------- | ------------------ | ----------------------- |
| `POST`  | `/api/tickets/buy` | Utilisateur authentifié |

Permet d’acheter ou de réserver un billet pour une séance donnée.

Lors de l’achat :

- si l’utilisateur possède des Super Billets, une place est utilisée en priorité ;
- sinon, le prix d’un billet classique, soit `14€`, est débité du solde de l’utilisateur ;
- si la séance est complète, l’achat est refusé ;
- si le solde est insuffisant, l’achat est refusé.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ       | Type     | Obligatoire | Description                                              |
| ----------- | -------- | ----------- | -------------------------------------------------------- |
| `sessionId` | `number` | Oui         | Identifiant de la séance pour laquelle acheter un billet |

**Réponse :** retourne un message de confirmation ainsi que le billet créé.

| Champ              | Type     | Description                                                                            |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| `message`          | `string` | Confirme l’achat ou la réservation du billet                                           |
| `ticket.id`        | `number` | Identifiant du billet                                                                  |
| `ticket.userId`    | `number` | Identifiant de l’utilisateur                                                           |
| `ticket.sessionId` | `number` | Identifiant de la séance réservée                                                      |
| `nouveauSolde`     | `number` | Nouveau solde de l’utilisateur, présent uniquement si le billet est payé avec le solde |
| `placesRestantes`  | `number` | Nombre de Super Billets restants, présent uniquement si un Super Billet est utilisé    |

| Code  | Description                                                |
| ----- | ---------------------------------------------------------- |
| `201` | Billet acheté ou réservé avec succès                       |
| `400` | Séance non précisée, séance complète ou fonds insuffisants |
| `401` | Token manquant ou expiré                                   |
| `404` | Séance ou utilisateur introuvable                          |
| `500` | Erreur lors de l’achat du billet                           |

---

#### Achat d’un Super Billet

| Méthode | URL                         | Accès                   |
| ------- | --------------------------- | ----------------------- |
| `POST`  | `/api/tickets/super-billet` | Utilisateur authentifié |

Permet d’acheter un carnet de 10 places appelé **Super Billet**.

L’achat d’un Super Billet :

- coûte `100€` ;
- ajoute `10` places au compte de l’utilisateur ;
- débite le solde de l’utilisateur ;
- nécessite un solde suffisant ;
- s’effectue via une logique transactionnelle pour garantir la cohérence des données.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

Aucun body n’est requis pour cette route.

**Réponse :** retourne le nouveau solde de l’utilisateur ainsi que son nombre de places restantes.

| Champ             | Type     | Description                                             |
| ----------------- | -------- | ------------------------------------------------------- |
| `message`         | `string` | Confirme l’achat du Super Billet                        |
| `nouveauSolde`    | `number` | Nouveau solde après débit des 100€                      |
| `placesRestantes` | `number` | Nombre total de Super Billets disponibles après l’achat |

| Code  | Description                    |
| ----- | ------------------------------ |
| `200` | Achat réussi, places créditées |
| `400` | Fonds insuffisants             |
| `401` | Token manquant ou expiré       |

---

## Argent et Transactions

Les routes liées au portefeuille permettent à un utilisateur authentifié d’ajouter ou de retirer de l’argent de son compte.  
Chaque opération modifie le solde de l’utilisateur et peut être associée à une transaction dans l’historique du compte.

#### Recharger le compte

| Méthode | URL                   | Accès                   |
| ------- | --------------------- | ----------------------- |
| `POST`  | `/api/users/recharge` | Utilisateur authentifié |

Permet d’ajouter un montant positif au solde du compte de l’utilisateur connecté.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ     | Type     | Obligatoire | Description                        |
| --------- | -------- | ----------- | ---------------------------------- |
| `montant` | `number` | Oui         | Montant positif à ajouter au solde |

**Réponse :** retourne un message de confirmation ainsi que le nouveau solde de l’utilisateur.

| Champ          | Type     | Description                            |
| -------------- | -------- | -------------------------------------- |
| `message`      | `string` | Confirme le rechargement du compte     |
| `nouveauSolde` | `number` | Solde mis à jour après le rechargement |

| Code  | Description                           |
| ----- | ------------------------------------- |
| `200` | Rechargement réussi                   |
| `400` | Montant invalide ou négatif           |
| `401` | Token manquant ou expiré              |
| `500` | Erreur lors du rechargement du compte |

---

#### Retirer de l’argent du compte

| Méthode | URL                   | Accès                   |
| ------- | --------------------- | ----------------------- |
| `POST`  | `/api/users/decharge` | Utilisateur authentifié |

Permet de retirer un montant du solde du compte de l’utilisateur connecté.

Le retrait est refusé si :

- le montant est invalide ;
- le montant est négatif ;
- le solde de l’utilisateur est insuffisant.

**Middleware utilisé :**

- `authenticate`

**Header requis :**

| Header          | Valeur           |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Champ     | Type     | Obligatoire | Description                        |
| --------- | -------- | ----------- | ---------------------------------- |
| `montant` | `number` | Oui         | Montant positif à retirer du solde |

**Réponse :** retourne un message de confirmation ainsi que le nouveau solde de l’utilisateur.

| Champ          | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `message`      | `string` | Confirme le retrait du compte     |
| `nouveauSolde` | `number` | Solde mis à jour après le retrait |

| Code  | Description                            |
| ----- | -------------------------------------- |
| `200` | Retrait effectué avec succès           |
| `400` | Montant invalide ou fonds insuffisants |
| `401` | Token manquant ou expiré               |
| `500` | Erreur lors du retrait                 |
