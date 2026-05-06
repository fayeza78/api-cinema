import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../config/db.js';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. On récupère direct l'ID validé par ton middleware 'authenticate' qui est passé juste avant
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(403).json({ message: "Impossible d'identifier l'utilisateur." });
      return;
    }

    // 2. On cherche l'utilisateur en base de données (ça règle ton erreur TS2304)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // 3. On bloque si ce n'est pas un admin
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Accès refusé. Réservé aux administrateurs.' });
      return;
    }

    // 4. C'est bien un admin, on le laisse passer vers le contrôleur
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la vérification des droits.' });
  }
};