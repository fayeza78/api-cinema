import { Router } from 'express';
import { rechargeAccount, dechargeAccount } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/users/recharge:
 *   post:
 *     summary: Recharge le solde du compte
 *     description: Ajoute un montant au portefeuille de l'utilisateur connecté et crée une transaction.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - montant
 *             properties:
 *               montant:
 *                 type: number
 *                 example: 50
 *                 description: Montant positif à ajouter au solde
 *     responses:
 *       '200':
 *         description: Rechargement réussi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rechargement réussi ! Vous avez ajouté 50€
 *                 nouveauSolde:
 *                   type: number
 *                   example: 150
 *       '400':
 *         description: Montant invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 montantInvalide:
 *                   summary: Montant manquant ou négatif
 *                   value:
 *                     message: Veuillez entrer un montant valide et positif.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '500':
 *         description: Erreur lors du rechargement du compte.
 */
router.post('/recharge', authenticate, rechargeAccount);

/**
 * @swagger
 * /api/users/decharge:
 *   post:
 *     summary: Retire de l'argent du compte
 *     description: Déduit un montant du portefeuille de l'utilisateur connecté vers son compte bancaire.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - montant
 *             properties:
 *               montant:
 *                 type: number
 *                 example: 30
 *                 description: Montant positif à retirer du solde
 *     responses:
 *       '200':
 *         description: Retrait effectué avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Retrait de 30€ effectué avec succès
 *                 nouveauSolde:
 *                   type: number
 *                   example: 70
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
 *                 montantInvalide:
 *                   summary: Montant manquant ou négatif
 *                   value:
 *                     message: Montant invalide.
 *                 fondsInsuffisants:
 *                   summary: Solde insuffisant pour le retrait
 *                   value:
 *                     message: Fonds insuffisants pour ce retrait.
 *       '401':
 *         description: Non autorisé (Token manquant ou expiré).
 *       '500':
 *         description: Erreur lors du retrait.
 */
router.post('/decharge', authenticate, dechargeAccount);

export default router;