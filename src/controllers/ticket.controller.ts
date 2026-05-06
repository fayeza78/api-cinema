import { type Response } from 'express';
import prisma from '../config/db.js';

const TICKET_PRICE = 14.0; 

export const buyTicket = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.body; 
    
    if (!userId) {
      res.status(401).json({ message: 'Non autorisé.' }); return;
    }
    if (!sessionId) {
      res.status(400).json({ message: 'Veuillez préciser la séance' }); return;
    }

    const session = await prisma.seance.findUnique({
      where: { id: sessionId },
      include: {
        room: true,
        _count: { select: { tickets: true } } 
      }
    });

    if (!session) {
      res.status(404).json({ message: 'Séance introuvable.' }); return;
    }

    if (session._count.tickets >= session.room.capacite) {
      res.status(400).json({ message: 'Séance complète ' }); return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable.' }); return;
    }

    if (user.superBillets > 0) {
      const result = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { superBillets: { decrement: 1 } } 
        }),
        prisma.transaction.create({
          data: {
            userId: userId,
            montant: 0, 
            description: `Utilisation d'un Super Billet pour la séance n°${sessionId}`
          }
        }),
        prisma.ticket.create({
          data: { userId: userId, sessionId: sessionId }
        })
      ]);

      res.status(201).json({ 
        message: 'Place réservée avec succès grâce à un Super Billet ! ', 
        ticket: result[2],
        placesRestantes: result[0].superBillets
      });
      return; 
    }

    if (user.solde < TICKET_PRICE) {
      res.status(400).json({ message: `Fonds insuffisants. Un billet coûte ${TICKET_PRICE}€. Veuillez recharger votre compte.` }); return;
    }

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { solde: { decrement: TICKET_PRICE } }
      }),
      prisma.transaction.create({
        data: {
          userId: userId,
          montant: -TICKET_PRICE, 
          description: `Achat d'un billet pour la séance n°${sessionId}`
        }
      }),
      prisma.ticket.create({
        data: { userId: userId, sessionId: sessionId }
      })
    ]);

    res.status(201).json({ 
      message: 'Billet acheté avec succès ', 
      ticket: result[2],
      nouveauSolde: result[0].solde
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'achat du billet.' });
  }
};

export const buySuperBillet = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const SUPER_BILLET_PRICE = 100.0; 

    if (!userId) {
      res.status(401).json({ message: 'Non autorisé.' }); return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.solde < SUPER_BILLET_PRICE) {
      res.status(400).json({ message: `Fonds insuffisants. Le Super Billet coûte ${SUPER_BILLET_PRICE}€.` }); return;
    }

    const updatedUser = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          solde: { decrement: SUPER_BILLET_PRICE },
          superBillets: { increment: 10 } 
        }
      }),
      prisma.transaction.create({
        data: {
          userId,
          montant: -SUPER_BILLET_PRICE,
          description: "Achat d'un Super Billet"
        }
      })
    ]);

    res.status(200).json({ 
      message: 'Super Billet acheté ! Vous avez 10 places créditées sur votre compte',
      nouveauSolde: updatedUser[0].solde,
      placesRestantes: updatedUser[0].superBillets
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'achat du Super Billet.' });
  }
};