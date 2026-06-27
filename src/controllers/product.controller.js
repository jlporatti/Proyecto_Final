import ProductService from '../services/product.service.js';

// Definimos el Controlador de productos
class ProductController {
  // GET /api/products - Obtenemos todos los productos
  static async getAllProducts(req, res, next) {
    try {
      const result = await ProductService.getAllProducts();
      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/:id - Obtenemos un producto por ID
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ProductService.getProductById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // POST /api/products/create - Creamos un nuevo producto
  static async createProduct(req, res, next) {
    try {
      const productData = req.body;

      // Validamos los datos
      const validation = ProductService.validateProductData(productData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Datos de producto inválidos',
          errors: validation.errors
        });
      }

      const result = await ProductService.createProduct(productData);
      return res.status(201).json(result);

    } catch (error) {
      next(error);
    }
  }

  // PUT /api/products/:id - Actualizamos un producto existente x ID
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const result = await ProductService.updateProduct(id, productData);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/products/:id - Eliminamos un producto x ID
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ProductService.deleteProduct(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/category/:category - Obtenemos productos por categoría
  static async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const result = await ProductService.getProductsByCategory(category);
      return res.status(200).json(result);
      
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
