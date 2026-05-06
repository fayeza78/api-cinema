import { Router } from 'express';
import { createSession, getSessions } from '../controllers/session.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Séances
 *   description: Gestion des séances de cinéma
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Crée une nouvelle séance
 *     description: Planifie une séance pour un film dans une salle. Le cinéma est ouvert uniquement en semaine entre 9h00 et 20h00.
 *     tags:
 *       - Séances
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - roomId
 *               - startTime
 *             properties:
 *               movieId:
 *                 type: number
 *                 example: 1
 *               roomId:
 *                 type: number
 *                 example: 2
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-10T14:00:00.000Z"
 *     responses:
 *       '201':
 *         description: Séance planifiée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Séance planifiée avec succès
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     movieId:
 *                       type: number
 *                       example: 1
 *                     roomId:
 *                       type: number
 *                       example: 2
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-10T14:00:00.000Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-10T16:30:00.000Z"
 *       '400':
 *         description: Champs manquants, cinéma fermé le week-end, horaire invalide ou conflit d'horaire.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '404':
 *         description: Film introuvable.
 *       '500':
 *         description: Erreur lors de la création de la séance.
 */
router.post('/', authenticate, isAdmin, createSession);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Récupère la liste des séances
 *     description: Retourne les séances disponibles (salles non en maintenance). Filtrable par film et par plage de dates. Les admins voient aussi le nombre de billets vendus.
 *     tags:
 *       - Séances
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrer par ID du film
 *         example: 1
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Date de début de la plage
 *         example: "2025-06-01T00:00:00.000Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Date de fin de la plage
 *         example: "2025-06-30T23:59:59.000Z"
 *     responses:
 *       '200':
 *         description: Liste des séances récupérée avec succès.
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
 *                   movieId:
 *                     type: number
 *                     example: 1
 *                   roomId:
 *                     type: number
 *                     example: 2
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-10T14:00:00.000Z"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-10T16:30:00.000Z"
 *                   movie:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       titre:
 *                         type: string
 *                         example: Inception
 *                       duree:
 *                         type: number
 *                         example: 148
 *                   room:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 2
 *                       nom:
 *                         type: string
 *                         example: Salle 2
 *                       capacite:
 *                         type: number
 *                         example: 25
 *       '500':
 *         description: Erreur lors de la récupération du planning.
 */
router.get('/', authenticate, getSessions);

// suppression et modification

export default router;