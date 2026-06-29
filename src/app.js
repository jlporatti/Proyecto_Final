import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase.config.js';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import { notFoundHandler, errorHandler, requestLogger } from './middlewares/error.middleware.js';

dotenv.config();

await initializeFirebase();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API REST de Productos - Proyecto Final Node.js',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        refresh: 'POST /auth/refresh',
        verify: 'GET /auth/verify',
        logout: 'POST /auth/logout'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        getByCategory: 'GET /api/products/category/:category',
        create: 'POST /api/products/create (requiere autenticación)',
        update: 'PUT /api/products/:id (requiere autenticación)',
        delete: 'DELETE /api/products/:id (requiere autenticación)'
      }
    },
    documentation: {
      credentials: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: 'admin123'
      },
      note: 'Use POST /auth/login para obtener el token JWT'
    }
  });
});

app.use('/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
