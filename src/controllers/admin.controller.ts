import { type Request, type Response } from 'express';
import prisma from '../config/db.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate as string) : new Date(new Date().setHours(23, 59, 59, 999));

    
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const totalTicketsGlobal = await prisma.ticket.count();
    const transactions = await prisma.transaction.aggregate({
      where: {
        montant: { lt: 0 }, 
        description: { not: { contains: 'Retrait' } } 
      },
      _sum: { montant: true }
    });
    const chiffreAffairesGlobal = Math.abs(transactions._sum.montant || 0);

    
    const seancesPeriod = await prisma.seance.findMany({
      where: {
        startTime: { gte: start, lte: end }
      },
      include: {
        room: true,
        _count: {
          select: { tickets: true }
        }
      }
    });

    let placesDisponiblesTotales = 0;
    let billetsVendusPeriode = 0;

    
    const detailsSeances = seancesPeriod.map(seance => {
      const capaciteSalle = seance.room.capacite;
      const ticketsVendus = seance._count.tickets;
      
      placesDisponiblesTotales += capaciteSalle;
      billetsVendusPeriode += ticketsVendus;

      const tauxRemplissageSeance = capaciteSalle > 0 ? (ticketsVendus / capaciteSalle) * 100 : 0;

      return {
        seanceId: seance.id,
        salle: seance.room.nom,
        horaire: seance.startTime,
        capacite: capaciteSalle,
        ticketsVendus: ticketsVendus,
        tauxRemplissage: `${tauxRemplissageSeance.toFixed(2)}%`
      };
    });


    const tauxRemplissageGlobal = placesDisponiblesTotales > 0 
      ? ((billetsVendusPeriode / placesDisponiblesTotales) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      message: 'Statistiques récupérées avec succès',
      vueGlobale: {
        clientsInscrits: totalClients,
        billetsVendusTotal: totalTicketsGlobal,
        chiffreAffairesTotal: chiffreAffairesGlobal
      },
      frequentation: {
        periodeRecherchee: { start, end },
        billetsVendusSurLaPeriode: billetsVendusPeriode,
        placesDisponiblesSurLaPeriode: placesDisponiblesTotales,
        tauxRemplissageGlobal: `${tauxRemplissageGlobal}%`,
        detailsParSeance: detailsSeances // Pour voir quelle salle marche le mieux !
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
  }
};