import { type Request, type Response } from 'express';
import prisma from '../config/db.js';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des films.' });
  }
};


export const createMovie = async (req: Request, res: Response) => {
  try {
    const { titre, description, duree, affiche } = req.body;

    if (!titre || !duree || !affiche) {
      res.status(400).json({ message: 'Le titre, la durée et l\'affiche sont obligatoires.' });
      return;
    }

    const newMovie = await prisma.movie.create({
      data: { titre, description, duree, affiche }
    });

    res.status(201).json({ message: 'Film ajouté avec succès', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du film.' });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { titre, description, duree, affiche } = req.body;

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { titre, description, duree, affiche }
    });

    res.status(200).json({ message: 'Film mis à jour', movie: updatedMovie });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification du film (ou film introuvable).' });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    await prisma.movie.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du film (ou film introuvable).' });
  }
};