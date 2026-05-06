import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Petite astuce TypeScript : On crée un type étendu pour dire que la requête peut contenir les infos de l'utilisateur
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. On cherche le badge d'accès dans les headers de la requête
  const authHeader = req.headers.authorization;

  // 2. Si pas de badge, ou s'il ne commence pas par "Bearer ", on recale l'utilisateur
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Accès refusé. Token manquant' });
    return;
  }

  // 3. On extrait le token (on coupe la chaîne "Bearer le_token_jwt" en deux)
  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Format du token invalide' });
    return;
  }

  try {
    // 4. On vérifie que le token est valide et qu'il n'a pas été falsifié
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // 5. On attache les infos décryptées (userId, role) à la requête pour que les autres fonctions puissent s'en servir
    req.user = decoded;

    // 6. Tout est bon, on laisse passer au contrôleur suivant !
    next();
  } catch (error) {
    // Si le token a expiré (plus de 5 minutes) ou est faux
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};