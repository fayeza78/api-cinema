import { type Request, type Response } from 'express';
import prisma from '../config/db.js';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des salles.' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { nom, capacite, description, images, type, acces_handicape, en_maintenance} = req.body;

    if (!nom || !capacite || !images || !type || !description) {
      res.status(400).json({ message: 'Le nom et la capacité sont requis.' });
      return;
    }

    if (capacite < 15 || capacite > 30) {
      res.status(400).json({ message: 'La capacité de la salle doit être comprise entre 15 et 30 places ' });
      return;
    }

    const newRoom = await prisma.room.create({
      data: {
        nom,
        description,
        images,
        type,
        capacite,
        acces_handicape
      }
    });

    res.status(201).json({
      message: 'Salle de cinéma créée avec succès',
      room: newRoom
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


export const seedRooms = async (req: Request, res: Response) => {
  try {
    const count = await prisma.room.count();
    if (count > 0) {
      res.status(400).json({ message: 'Les salles existent déjà dans la base de données !' });
      return;
    }

    const roomsData = [];
    for (let i = 1; i <= 10; i++) {
      const randomCapacity = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
      
        roomsData.push({ 
        nom: `Salle ${i}`, 
        description: `Une magnifique salle de cinéma numéro ${i}`,
        images: '["https://exemple.com/salle.jpg"]', 
        type: i % 2 === 0 ? "3D" : "Classique", 
        capacite: randomCapacity 
      });
    }

    await prisma.room.createMany({
      data: roomsData
    });

    res.status(201).json({ 
      message: 'Les 10 salles ont été créées avec succès !', 
      salles: roomsData 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la génération des salles.' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { nom, capacite, description, images, type, acces_handicape, en_maintenance } = req.body;

    if (!nom || !capacite || !images || !type || !description) {
      res.status(400).json({ message: 'Le nom et la capacité sont requis.' });
      return;
    }

    if (capacite && (capacite < 15 || capacite > 30)) {
      res.status(400).json({ message: 'La capacité de la salle doit être comprise entre 15 et 30 places.' });
      return;
    }

    const updatedRoom = await prisma.room.update({
      where: { id},
      data: {
        nom,
        description,
        images,
        type,
        capacite,
        acces_handicape,
        en_maintenance
      }
    });

    res.status(200).json({
      message: 'Salle modifiée avec succès',
      room: updatedRoom
    });

  } catch (error: any) {
    console.error(error);
    
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Salle introuvable.' });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur lors de la modification.' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    await prisma.room.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Salle supprimée avec succès.' });

  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Salle introuvable.' });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur lors de la suppression.' });
  }
};