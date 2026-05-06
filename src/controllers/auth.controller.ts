import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { type AuthRequest } from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe sont requis.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe sont requis.' });
      return;
    }

    // 2. Chercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Identifiants incorrects.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Identifiants incorrects.' });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '20m' } 
    //   { expiresIn: '5m' } 20min pour les tests sur postman
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expiresAt
      }
    });

    res.status(200).json({
      message: 'Connexion réussie',
      access_token: accessToken,
      refresh_token: refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Utilisateur non identifié.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        solde: true, 
        superBillets: true,
        createdAt: true,
        transactions: {
            orderBy: {createdAt: 'desc'}
        },
        tickets: {
          include: {
            session: {
              include: {
                movie: true,
                room: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable.' });
      return;
    }

    res.status(200).json({
      message: 'Espace sécurisé',
      profil: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh Token manquant.' });
      return;
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });

    res.status(200).json({ message: 'Déconnexion réussie ! Tous les tokens liés sont révoqués' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
  }
};
