import express, { type Request, type Response } from 'express';
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import movieRoutes from './routes/movie.routes.js';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import sessionRoutes from './routes/session.routes.js';
import adminRoutes from './routes/admin.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = 3002;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Review',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la gestion du cinéma',
      contact: {
        name: 'Fayeza & Meriam',
      }
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: [path.join(__dirname, 'routes/*.js')], 
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send(' Bienvenue chez Review');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré avec succès sur http://localhost:${PORT}`);
});