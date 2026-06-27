import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Servicio de autenticación
class AuthService {
  // Validamos las credenciales del usuario - Colocar en la BD o en un archivo de configuración seguro en producción
  static validateCredentials(email, password) {
    // Credenciales de prueba desde variables de entorno
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      return {
        id: '1',
        email: email,
        role: 'admin',
        name: 'Administrador'
      };
    }
    return null;
  }

  // Generamos un token JWT para el usuario
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
    );

    return token;
  }

  // Verificamos el token JWT
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;

    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  // Procesamos el login del usuario
  static login(email, password) {
    // Validamos que se haya proporcionen email y password
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Validamos las credenciales
    const user = this.validateCredentials(email, password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Generamos el token
    const token = this.generateToken(user);

    return {
      success: true,
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  // Refrescamos un token existente
  static refreshToken(oldToken) {
    try {
      const decoded = this.verifyToken(oldToken);
      
      // Creamos un nuevo token con los mismos datos
      const user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };

      const newToken = this.generateToken(user);

      return {
        success: true,
        message: 'Token refrescado exitosamente',
        token: newToken
      };
      
    } catch (error) {
      throw new Error('No se pudo refrescar el token: ' + error.message);
    }
  }
}

export default AuthService;
