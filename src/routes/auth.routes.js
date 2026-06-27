import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Iniciar sesión y obtener token JWT
 * @access  Public
 */
router.post('/login', AuthController.login);

/**
 * @route   POST /auth/refresh
 * @desc    Refrescar token JWT
 * @access  Public
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @route   GET /auth/verify
 * @desc    Verificar si el token es válido
 * @access  Private
 */
router.get('/verify', verifyToken, AuthController.verifyToken);

/**
 * @route   POST /auth/logout
 * @desc    Cerrar sesión (eliminar token en el cliente)
 * @access  Private
 */
router.post('/logout', verifyToken, AuthController.logout);

export default router;
