import { Router } from 'express';
import { buyTicket } from '../controllers/ticket.controller.js';
import { buySuperBillet } from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/tickets/buy:
 *   post:
 *     summary: Achète un billet pour une séance
 *     description: >
 *       Réserve une place pour une séance donnée. 
 *       Si l'utilisateur possède des Super Billets, ils sont utilisés en priorité (gratuit).
 *       Sinon, 14€ sont débités de son solde.
 *     tags:
 *       - Billetterie
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Billet acheté ou réservé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billet acheté avec succès
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     userId:
 *                       type: number
 *                       example: 3
 *                     sessionId:
 *                       type: number
 *                       example: 1
 *                 nouveauSolde:
 *                   type: number
 *                   example: 86
 *                   description: Présent uniquement si payé par solde
 *                 placesRestantes:
 *                   type: number
 *                   example: 4
 *                   description: Présent uniquement si payé par Super Billet
 *       '400':
 *         description: Erreur de validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 sessionManquante:
 *                   summary: Session non précisée
 *                   value:
 *                     message: Veuillez préciser la séance
 *                 seanceComplete:
 *                   summary: Séance complète
 *                   value:
 *                     message: Séance complète
 *                 fondsInsuffisants:
 *                   summary: Solde insuffisant
 *                   value:
 *                     message: Fonds insuffisants. Un billet coûte 14€. Veuillez recharger votre compte.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '404':
 *         description: Ressource introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 seanceIntrouvable:
 *                   summary: Séance introuvable
 *                   value:
 *                     message: Séance introuvable.
 *                 utilisateurIntrouvable:
 *                   summary: Utilisateur introuvable
 *                   value:
 *                     message: Utilisateur introuvable.
 *       '500':
 *         description: Erreur lors de l'achat du billet.
 */
router.post('/buy', authenticate, buyTicket);

/**
 * @swagger
 * /api/tickets/super-billet:
 *   post:
 *     summary: Achète un carnet de 10 places (Super Billet)
 *     description: Débite le solde du client de 100€ et lui ajoute 10 places. Nécessite un token d'authentification valide.
 *     tags: 
 *       - Billetterie
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       '200':
 *         description: Achat réussi, places créditées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 nouveauSolde:
 *                   type: number
 *                 placesRestantes:
 *                   type: number
 *       '400':
 *         description: Fonds insuffisants.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 */
router.post('/super-billet', authenticate, buySuperBillet);

export default router;