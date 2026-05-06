import { type Request, type Response } from 'express';
import prisma from '../config/db.js';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { movieId, roomId, startTime } = req.body;

    if (!movieId || !roomId || !startTime) {
      res.status(400).json({ message: 'movieId, roomId et startTime sont obligatoires.' });
      return;
    }

    const sessionStart = new Date(startTime);

    const day = sessionStart.getDay(); 
    if (day === 0 || day === 6) {
      res.status(400).json({ message: 'Le cinéma est fermé le week-end' });
      return;
    }

    const hour = sessionStart.getHours(); 
    if (hour < 9 || hour >= 20) {
      res.status(400).json({ message: 'Les séances doivent commencer entre 9h00 et 20h00' });
      return;
    }

    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      res.status(404).json({ message: 'Film introuvable.' });
      return;
    }

    const durationInMs = (movie.duree + 30) * 60000;
    const sessionEnd = new Date(sessionStart.getTime() + durationInMs);

    
    const overlap = await prisma.seance.findFirst({
      where: {
        OR: [
          { roomId: roomId },   
          { movieId: movieId }  
        ],
        startTime: { lt: sessionEnd },
        endTime: { gt: sessionStart }
      }
    });

    if (overlap) {
      res.status(400).json({ message: 'Conflit d\'horaire ! La salle est occupée ou le film passe déjà à cette heure-là 🛑' });
      return;
    }

    const newSession = await prisma.seance.create({
      data: {
        movieId,
        roomId,
        startTime: sessionStart,
        endTime: sessionEnd 
      }
    });

    res.status(201).json({ message: 'Séance planifiée avec succès', session: newSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la séance.' });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const { movieId, startDate, endDate } = req.query;
    
    const userRole = (req as any).user?.role || "CLIENT"; 

    const whereClause: any = {
      room: {
        en_maintenance: false
      }
    };

    if (movieId) {
      whereClause.movieId = parseInt(movieId as string, 10);
    }

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const sessions = await prisma.seance.findMany({
      where: whereClause,
      include: {
        movie: true, 
        room: true,
        _count: userRole === 'ADMIN' ? { select: { tickets: true } } : false
      },
      orderBy: {
        startTime: 'asc' 
      }
    });

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du planning.' });
  }
};