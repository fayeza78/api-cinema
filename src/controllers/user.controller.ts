import { type Response } from 'express';
import prisma from '../config/db.js';

export const rechargeAccount = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { montant } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Utilisateur non identifié.' });
      return;
    }

    if (!montant || typeof montant !== 'number' || montant <= 0) {
      res.status(400).json({ message: 'Veuillez entrer un montant valide et positif.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        solde: {
          increment: montant
        },
        transactions: {
          create: {
            montant: montant,
            description: 'Rechargement du portefeuille'
          }
        }
      }
    });

    res.status(200).json({ 
      message: `Rechargement réussi ! Vous avez ajouté ${montant}€`,
      nouveauSolde: updatedUser.solde 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du rechargement du compte.' });
  }
};

export const dechargeAccount = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { montant } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Non autorisé.' }); return;
    }
    if (!montant || typeof montant !== 'number' || montant <= 0) {
      res.status(400).json({ message: 'Montant invalide.' }); return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.solde < montant) {
      res.status(400).json({ message: 'Fonds insuffisants pour ce retrait.' }); return;
    }

    const updatedUser = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { solde: { decrement: montant } }
      }),
      prisma.transaction.create({
        data: {
          userId,
          montant: -montant,
          description: `Retrait d'argent vers compte bancaire`
        }
      })
    ]);

    res.status(200).json({ 
      message: `Retrait de ${montant}€ effectué avec succès `,
      nouveauSolde: updatedUser[0].solde 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du retrait.' });
  }
};


export const getAllTransactions = async (req: any, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } } 
      }
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions.' });
  }
};