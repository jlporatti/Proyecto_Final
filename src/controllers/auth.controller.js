import AuthService from '../services/auth.service.js';

// Definimos el Controlador de autenticación
class AuthController {
  // POST /auth/login - Manejamos el inicio de sesión del usuario

  static async login(req, res, next) {

    try {
      const { email, password } = req.body;

      // Validamos que se proporcionen los datos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Procesamos el login
      const result = AuthService.login(email, password);
      return res.status(200).json(result);

    } catch (error) {
      // Si las credenciales son inválidas, retornamos 401
      if (error.message.includes('Credenciales inválidas')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      // Otros errores
      next(error);
    }
  }

  // POST /auth/refresh - Refrescamos un token existente

  static async refreshToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Formato de token inválido'
        });
      }

      const result = AuthService.refreshToken(token);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /auth/verify - Verificamos si un token es válido
  static async verifyToken(req, res, next) {
    try {
      // Si llegamos aca es porque el middleware de autenticación ya validó el token
      return res.status(200).json({
        success: true,
        message: 'Token válido',
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/logout - Cierra la sesión del usuario (en el cliente se debe eliminar el token)
  static async logout(req, res, next) {
    try {
      // En JWT, el logout se maneja en el cliente eliminando el token
      // Aquí solo confirmamos la acción
      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente. Por favor, elimine el token del cliente.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;

