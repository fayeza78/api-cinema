import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: utilisateur@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: utilisateur@email.com
 *                     role:
 *                       type: string
 *                       example: CLIENT
 *       '400':
 *         description: Email et mot de passe sont requis.
 *       '409':
 *         description: Cet email est déjà utilisé.
 *       '500':
 *         description: Erreur interne du serveur.
 */
router.post('/register', register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie (retourne le token)
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', login);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     description: Retourne les informations complètes du profil incluant le solde, les Super Billets, les transactions et les billets achetés avec les détails des séances.
 *     tags:
 *       - Authentification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Profil récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Espace sécurisé
 *                 profil:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: utilisateur@email.com
 *                     role:
 *                       type: string
 *                       example: CLIENT
 *                     solde:
 *                       type: number
 *                       example: 100
 *                     superBillets:
 *                       type: number
 *                       example: 3
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T10:30:00.000Z"
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           montant:
 *                             type: number
 *                             example: -14
 *                           description:
 *                             type: string
 *                             example: Achat d'un billet pour la séance n°1
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-10T14:00:00.000Z"
 *                     tickets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           session:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                                 example: 1
 *                               startTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-06-10T14:00:00.000Z"
 *                               endTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-06-10T16:30:00.000Z"
 *                               movie:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                     example: 1
 *                                   titre:
 *                                     type: string
 *                                     example: Inception
 *                                   duree:
 *                                     type: number
 *                                     example: 148
 *                               room:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                     example: 2
 *                                   nom:
 *                                     type: string
 *                                     example: Salle 2
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '404':
 *         description: Utilisateur introuvable.
 *       '500':
 *         description: Erreur lors de la récupération du profil.
 */
router.get('/me', authenticate, getProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnecte l'utilisateur
 *     description: Révoque le refresh token de l'utilisateur et le supprime de la base de données.
 *     tags:
 *       - Authentification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Déconnexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie ! Tous les tokens liés sont révoqués
 *       '400':
 *         description: Refresh Token manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 tokenManquant:
 *                   summary: Refresh token absent du body
 *                   value:
 *                     message: Refresh Token manquant.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '500':
 *         description: Erreur lors de la déconnexion.
 */
router.post('/logout', authenticate, logout);

export default router;