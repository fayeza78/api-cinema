import { type Response } from 'express';
import prisma from '../config/db.js';

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const totalClients = await prisma.user.count({
      where: { role: 'CLIENT' }
    });

    const totalTickets = await prisma.ticket.count();

     const transactions = await prisma.transaction.aggregate({
      where: {
        montant: { lt: 0 }, 
        description: { not: { contains: 'Retrait' } } 
      },
      _sum: {
        montant: true
      }
    });

    const chiffreAffaires = Math.abs(transactions._sum.montant || 0);

      res.status(200).json({
      message: 'Tableau de bord de Review',
      stats: {
        clientsInscrits: totalClients,
        billetsVendus: totalTickets,
        chiffreAffairesEuros: chiffreAffaires
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
  }
};