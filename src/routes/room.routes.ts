import { Router } from 'express';
import { getRooms, createRoom, seedRooms } from '../controllers/room.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Salles
 *   description: Gestion des salles de cinéma
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Récupère la liste de toutes les salles
 *     tags:
 *       - Salles
 *     responses:
 *       '200':
 *         description: Liste des salles récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: Salle 1
 *                   description:
 *                     type: string
 *                     example: Une magnifique salle de cinéma
 *                   images:
 *                     type: string
 *                     example: '["https://exemple.com/salle.jpg"]'
 *                   type:
 *                     type: string
 *                     example: 3D
 *                   capacite:
 *                     type: number
 *                     example: 25
 *                   acces_handicape:
 *                     type: boolean
 *                     example: true
 *                   en_maintenance:
 *                     type: boolean
 *                     example: false
 *       '500':
 *         description: Erreur serveur.
 */
router.get('/', getRooms);

/**
 * @swagger
 * /api/rooms/seed:
 *   post:
 *     summary: Génère 10 salles de cinéma par défaut
 *     description: Crée automatiquement 10 salles avec des capacités aléatoires entre 15 et 30 places. Échoue si des salles existent déjà.
 *     tags:
 *       - Salles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Les 10 salles ont été créées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Les 10 salles ont été créées avec succès !
 *                 salles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nom:
 *                         type: string
 *                         example: Salle 1
 *                       description:
 *                         type: string
 *                         example: Une magnifique salle de cinéma numéro 1
 *                       images:
 *                         type: string
 *                         example: '["https://exemple.com/salle.jpg"]'
 *                       type:
 *                         type: string
 *                         example: Classique
 *                       capacite:
 *                         type: number
 *                         example: 20
 *       '400':
 *         description: Les salles existent déjà dans la base de données.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '500':
 *         description: Erreur lors de la génération des salles.
 */
router.post('/seed', authenticate, seedRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Crée une nouvelle salle de cinéma
 *     tags:
 *       - Salles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - capacite
 *               - images
 *               - type
 *               - description
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Salle 1
 *               description:
 *                 type: string
 *                 example: Une magnifique salle de cinéma
 *               images:
 *                 type: string
 *                 example: '["https://exemple.com/salle.jpg"]'
 *               type:
 *                 type: string
 *                 example: 3D
 *               capacite:
 *                 type: number
 *                 example: 25
 *                 description: Doit être entre 15 et 30 places
 *               acces_handicape:
 *                 type: boolean
 *                 example: true
 *               en_maintenance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       '201':
 *         description: Salle créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Salle de cinéma créée avec succès
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     nom:
 *                       type: string
 *                       example: Salle 1
 *                     description:
 *                       type: string
 *                       example: Une magnifique salle de cinéma
 *                     images:
 *                       type: string
 *                       example: '["https://exemple.com/salle.jpg"]'
 *                     type:
 *                       type: string
 *                       example: 3D
 *                     capacite:
 *                       type: number
 *                       example: 25
 *                     acces_handicape:
 *                       type: boolean
 *                       example: true
 *       '400':
 *         description: Champs obligatoires manquants ou capacité invalide (doit être entre 15 et 30).
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '500':
 *         description: Erreur interne du serveur.
 */
router.post('/', authenticate, createRoom);

// supprimer et modifier

export default router;