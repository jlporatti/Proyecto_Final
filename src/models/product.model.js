import { getFirestore } from '../config/firebase.config.js';

const COLLECTION_NAME = 'products';

// Modelo de Producto para interactuar con Firestore
class ProductModel {
  // Obtenemos todos los productos
  static async getAll() {
    try {
      const db = getFirestore();
      
      if (!db) {
        // Modo mock si Firebase no está configurado
        return [
          {
            id: '1',
            name: 'Producto Demo 1',
            description: 'Descripción del producto demo 1',
            price: 99.99,
            stock: 10,
            category: 'Electrónica',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Producto Demo 2',
            description: 'Descripción del producto demo 2',
            price: 149.99,
            stock: 5,
            category: 'Hogar',
            createdAt: new Date().toISOString()
          }
        ];
      }

      const snapshot = await db.collection(COLLECTION_NAME).get();
      const products = [];
      
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw new Error('Error al obtener los productos: ' + error.message);
    }
  }

// Obtenemos un producto por ID
  static async getById(id) {
    try {
      const db = getFirestore();
      
      if (!db) {
        // Modo mock
        return {
          id: id,
          name: 'Producto Demo',
          description: 'Descripción del producto demo',
          price: 99.99,
          stock: 10,
          category: 'General',
          createdAt: new Date().toISOString()
        };
      }

      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw new Error('Error al obtener el producto: ' + error.message);
    }
  }

  // Creamos un nuevo producto
  static async create(productData) {
    try {
      const db = getFirestore();
      
      // Validar datos requeridos
      if (!productData.name || !productData.price) {
        throw new Error('Nombre y precio son campos requeridos');
      }

      const newProduct = {
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        category: productData.category || 'General',
        imageUrl: productData.imageUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!db) {
        // Modo mock
        return {
          id: Date.now().toString(),
          ...newProduct
        };
      }

      const docRef = await db.collection(COLLECTION_NAME).add(newProduct);
      
      return {
        id: docRef.id,
        ...newProduct
      };
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error('Error al crear el producto: ' + error.message);
    }
  }


  // Actualizamos un producto existente
  static async update(id, productData) {
    try {
      const db = getFirestore();
      
      if (!db) {
        // Modo mock
        return {
          id: id,
          ...productData,
          updatedAt: new Date().toISOString()
        };
      }

      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData = {
        ...productData,
        updatedAt: new Date().toISOString()
      };

      // Eliminamos campos no definidos
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error('Error al actualizar el producto: ' + error.message);
    }
  }

  // Eliminamos un producto
  static async delete(id) {
    try {
      const db = getFirestore();
      
      if (!db) {
        // Modo mock
        return true;
      }

      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto: ' + error.message);
    }
  }

  // Buscamos productos por categoría
  static async getByCategory(category) {
    try {
      const db = getFirestore();
      
      if (!db) {
        // Modo mock
        return [];
      }

      const snapshot = await db.collection(COLLECTION_NAME)
        .where('category', '==', category)
        .get();
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw new Error('Error al buscar productos por categoría: ' + error.message);
    }
  }
}

export default ProductModel;

