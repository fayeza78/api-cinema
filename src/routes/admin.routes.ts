import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js'; 

const router = Router();

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Récupère les statistiques du tableau de bord
 *     description: Retourne les statistiques générales du cinéma. Accessible uniquement aux administrateurs.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Statistiques récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tableau de bord de Review
 *                 stats:
 *                   type: object
 *                   properties:
 *                     clientsInscrits:
 *                       type: number
 *                       example: 120
 *                     billetsVendus:
 *                       type: number
 *                       example: 1500
 *                     chiffreAffairesEuros:
 *                       type: number
 *                       example: 4200.50
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '403':
 *         description: Accès refusé (rôle admin requis).
 *       '500':
 *         description: Erreur serveur lors de la récupération des statistiques.
 */
router.get('/stats', authenticate, isAdmin, getDashboardStats);

export default router;