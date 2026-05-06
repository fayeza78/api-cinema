import { Router } from 'express';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../controllers/movie.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Gestion des films du cinéma Review
 */

/**
 * @swagger
 * /api/movie:
 *   get:
 *     summary: Récupère la liste de tous les films
 *     tags:
 *       - Films
 *     responses:
 *       '200':
 *         description: Liste des films récupérée avec succès.
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
 *                   titre:
 *                     type: string
 *                     example: Inception
 *                   description:
 *                     type: string
 *                     example: Un film de Christopher Nolan
 *                   duree:
 *                     type: number
 *                     example: 148
 *                   affiche:
 *                     type: string
 *                     example: https://example.com/affiche.jpg
 *       '500':
 *         description: Erreur serveur.
 */
router.get('/', getMovies);

/**
 * @swagger
 * /api/movie:
 *   post:
 *     summary: Crée un nouveau film
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - duree
 *               - affiche
 *             properties:
 *               titre:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: Un film de Christopher Nolan
 *               duree:
 *                 type: number
 *                 example: 148
 *               affiche:
 *                 type: string
 *                 example: https://example.com/affiche.jpg
 *     responses:
 *       '201':
 *         description: Film ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Film ajouté avec succès
 *                 movie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     titre:
 *                       type: string
 *                       example: Inception
 *                     description:
 *                       type: string
 *                       example: Un film de Christopher Nolan
 *                     duree:
 *                       type: number
 *                       example: 148
 *                     affiche:
 *                       type: string
 *                       example: https://example.com/affiche.jpg
 *       '400':
 *         description: Champs obligatoires manquants (titre, durée ou affiche).
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '403':
 *         description: Accès refusé (rôle admin requis).
 *       '500':
 *         description: Erreur serveur.
 */
router.post('/', authenticate, isAdmin, createMovie);

/**
 * @swagger
 * /api/movie/{id}:
 *   put:
 *     summary: Met à jour un film existant
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film à modifier
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: Un film de Christopher Nolan
 *               duree:
 *                 type: number
 *                 example: 148
 *               affiche:
 *                 type: string
 *                 example: https://example.com/affiche.jpg
 *     responses:
 *       '200':
 *         description: Film mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Film mis à jour
 *                 movie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     titre:
 *                       type: string
 *                       example: Inception
 *                     description:
 *                       type: string
 *                       example: Un film de Christopher Nolan
 *                     duree:
 *                       type: number
 *                       example: 148
 *                     affiche:
 *                       type: string
 *                       example: https://example.com/affiche.jpg
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '403':
 *         description: Accès refusé (rôle admin requis).
 *       '500':
 *         description: Erreur serveur (ou film introuvable).
 */
router.put('/:id', authenticate, isAdmin, updateMovie);

/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     summary: Supprime un film
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film à supprimer
 *         example: 1
 *     responses:
 *       '200':
 *         description: Film supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Film supprimé avec succès
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '403':
 *         description: Accès refusé (rôle admin requis).
 *       '500':
 *         description: Erreur serveur (ou film introuvable).
 */
router.delete('/:id', authenticate, isAdmin, deleteMovie);

export default router;