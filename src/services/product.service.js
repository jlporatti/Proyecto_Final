import ProductModel from '../models/product.model.js';

// Servicio de productos - Capa de lógica de negocio
class ProductService {
  // Obtiene todos los productos
  static async getAllProducts() {
    try {
      const products = await ProductModel.getAll();
      return {
        success: true,
        count: products.length,
        data: products
      };
    } catch (error) {
      throw new Error('Error al obtener productos: ' + error.message);
    }
  }

  // Obtenemos un producto por ID
  static async getProductById(id) {
    try {
      if (!id) {
        throw new Error('ID de producto es requerido');
      }

      const product = await ProductModel.getById(id);
      
      if (!product) {
        return {
          success: false,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        data: product
      };
    } catch (error) {
      throw new Error('Error al obtener producto: ' + error.message);
    }
  }

  // Creamos un nuevo producto
  static async createProduct(productData) {
    try {
      // Validaciones
      if (!productData.name) {
        throw new Error('El nombre del producto es requerido');
      }

      if (!productData.price || productData.price <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      if (productData.stock && productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      const newProduct = await ProductModel.create(productData);

      return {
        success: true,
        message: 'Producto creado exitosamente',
        data: newProduct
      };
    } catch (error) {
      throw new Error('Error al crear producto: ' + error.message);
    }
  }

  // Actualizamos un producto existente
  static async updateProduct(id, productData) {
    try {
      if (!id) {
        throw new Error('ID de producto es requerido');
      }

      // Hacemos las Validaciones
      if (productData.price !== undefined && productData.price <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      if (productData.stock !== undefined && productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      const updatedProduct = await ProductModel.update(id, productData);

      if (!updatedProduct) {
        return {
          success: false,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        message: 'Producto actualizado exitosamente',
        data: updatedProduct
      };
    } catch (error) {
      throw new Error('Error al actualizar producto: ' + error.message);
    }
  }

  // Eliminamos un producto
  static async deleteProduct(id) {
    try {
      if (!id) {
        throw new Error('ID de producto es requerido');
      }

      const deleted = await ProductModel.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        message: 'Producto eliminado exitosamente'
      };
    } catch (error) {
      throw new Error('Error al eliminar producto: ' + error.message);
    }
  }

  // Buscamos productos por categoría
  static async getProductsByCategory(category) {
    try {
      if (!category) {
        throw new Error('La Categoría es requerida');
      }

      const products = await ProductModel.getByCategory(category);

      return {
        success: true,
        count: products.length,
        data: products
      };
    } catch (error) {
      throw new Error('Error al buscar productos por categoría: ' + error.message);
    }
  }

  // Validamos los datos de un producto
  static validateProductData(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('El nombre es requerido');
    }

    if (!data.price || isNaN(data.price) || data.price <= 0) {
      errors.push('El precio debe ser un número mayor a 0');
    }

    if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
      errors.push('El stock debe ser un número mayor o igual a 0');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default ProductService;
