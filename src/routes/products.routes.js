import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos
 * @access  Public
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener un producto por ID
 * @access  Public
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route   GET /api/products/category/:category
 * @desc    Obtener productos por categoría
 * @access  Public
 */
router.get('/category/:category', ProductController.getProductsByCategory);

/**
 * @route   POST /api/products/create
 * @desc    Crear un nuevo producto
 * @access  Private (requiere autenticación)
 */
router.post('/create', verifyToken, ProductController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar un producto existente
 * @access  Private (requiere autenticación)
 */
router.put('/:id', verifyToken, ProductController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar un producto
 * @access  Private (requiere autenticación)
 */
router.delete('/:id', verifyToken, ProductController.deleteProduct);

export default router;
