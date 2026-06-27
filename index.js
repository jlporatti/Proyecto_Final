import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeFirebase } from './src/config/firebase.config.js';
import authRoutes from './src/routes/auth.routes.js';
import productsRoutes from './src/routes/products.routes.js';
import { notFoundHandler, errorHandler, requestLogger } from './src/middlewares/error.middleware.js';

// Cargamos las variables de entorno
dotenv.config();

// Inicializamos Firebase
await initializeFirebase();

// Creamos la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Habilitamos CORS para peticiones de origen cruzado
app.use(bodyParser.json()); // Parseamos body en formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parseamos URL-encoded bodies
app.use(requestLogger); // Logger de peticiones

// Ruta de bienvenida
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

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/api/products', productsRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor iniciado exitosamente');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('📚 Endpoints disponibles:');
  console.log('   GET  /                          - Información de la API');
  console.log('   POST /auth/login                - Iniciar sesión');
  console.log('   GET  /api/products              - Obtener todos los productos');
  console.log('   GET  /api/products/:id          - Obtener producto por ID');
  console.log('   POST /api/products/create       - Crear producto (requiere auth)');
  console.log('   PUT  /api/products/:id          - Actualizar producto (requiere auth)');
  console.log('   DELETE /api/products/:id        - Eliminar producto (requiere auth)');
  console.log('='.repeat(50));
  console.log('💡 Credenciales de prueba:');
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log('='.repeat(50));
});

// Manejamos los errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

export default app;
