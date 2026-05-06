import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion des statistiques administrateur
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Récupère les statistiques et la fréquentation du cinéma
 *     description: >
 *       Retourne les statistiques globales (chiffre d'affaires,
 *       clients inscrits, billets vendus) ainsi que le taux de
 *       remplissage sur une période donnée.
 *       Accessible uniquement aux administrateurs.
 *
 *     tags:
 *       - Admin
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début (optionnel)
 *         example: 2026-05-01T00:00:00.000Z
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin (optionnel)
 *         example: 2026-05-31T23:59:59.000Z
 *
 *     responses:
 *       '200':
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Statistiques récupérées avec succès
 *
 *                 vueGlobale:
 *                   type: object
 *                   properties:
 *                     clientsInscrits:
 *                       type: number
 *                       example: 120
 *
 *                     billetsVendusTotal:
 *                       type: number
 *                       example: 1500
 *
 *                     chiffreAffairesTotal:
 *                       type: number
 *                       example: 4200.50
 *
 *                 frequentation:
 *                   type: object
 *                   properties:
 *                     periodeRecherchee:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           example: 2026-05-06T00:00:00.000Z
 *
 *                         end:
 *                           type: string
 *                           example: 2026-05-06T23:59:59.999Z
 *
 *                     billetsVendusSurLaPeriode:
 *                       type: number
 *                       example: 45
 *
 *                     placesDisponiblesSurLaPeriode:
 *                       type: number
 *                       example: 100
 *
 *                     tauxRemplissageGlobal:
 *                       type: string
 *                       example: 45.00%
 *
 *                     detailsParSeance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           seanceId:
 *                             type: number
 *                             example: 1
 *
 *                           salle:
 *                             type: string
 *                             example: Salle IMAX
 *
 *                           horaire:
 *                             type: string
 *                             example: 2026-05-06T14:00:00.000Z
 *
 *                           capacite:
 *                             type: number
 *                             example: 30
 *
 *                           ticketsVendus:
 *                             type: number
 *                             example: 25
 *
 *                           tauxRemplissage:
 *                             type: string
 *                             example: 83.33%
 *
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré)
 *
 *       '403':
 *         description: Accès refusé (rôle admin requis)
 *
 *       '500':
 *         description: Erreur serveur lors de la récupération des statistiques
 */
router.get('/stats', authenticate, isAdmin, getDashboardStats);

export default router;