# API REST de Productos - Proyecto Final Node.js

API REST completa para la gestión de productos con autenticación JWT y base de datos Firebase/Firestore.

## 📋 Descripción

Este proyecto es una API REST desarrollada con Node.js y Express que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos. Incluye autenticación mediante JWT (JSON Web Tokens) y utiliza Firebase/Firestore como base de datos en la nube.

## ✨ Características

- ✅ **API REST** completa con Express.js
- ✅ **Autenticación JWT** para proteger endpoints
- ✅ **Firebase/Firestore** como base de datos
- ✅ **Arquitectura en capas** (Routes, Controllers, Services, Models)
- ✅ **Manejo de errores** centralizado
- ✅ **CORS** habilitado
- ✅ **Variables de entorno** con dotenv
- ✅ **Modo mock** para desarrollo sin Firebase
- ✅ **Documentación completa** paso a paso

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Firebase Admin SDK** - Base de datos Firestore
- **JSON Web Token (JWT)** - Autenticación
- **dotenv** - Variables de entorno
- **cors** - Manejo de CORS
- **body-parser** - Parseo de requests

## 📁 Estructura del Proyecto

```
Proyecto_Final/
├── src/
│   ├── config/
│   │   └── firebase.config.js      # Configuración de Firebase
│   ├── controllers/
│   │   ├── auth.controller.js      # Controlador de autenticación
│   │   └── product.controller.js   # Controlador de productos
│   ├── middlewares/
│   │   ├── auth.middleware.js      # Middleware de autenticación JWT
│   │   └── error.middleware.js     # Middleware de manejo de errores
│   ├── models/
│   │   └── product.model.js        # Modelo de productos (Firestore)
│   ├── routes/
│   │   ├── auth.routes.js          # Rutas de autenticación
│   │   └── products.routes.js      # Rutas de productos
│   └── services/
│       ├── auth.service.js         # Lógica de negocio de auth
│       └── product.service.js      # Lógica de negocio de productos
├── docs/
│   ├── INSTALACION.md              # Guía de instalación
│   ├── FIREBASE.md                 # Guía de configuración de Firebase
│   └── PRUEBAS.md                  # Guía de pruebas
├── Consigna/
│   ├── ProyectoFinal.txt           # Consigna del proyecto
│   └── Directivas.txt              # Directivas del proyecto
├── .env                            # Variables de entorno (no subir a Git)
├── .env.example                    # Ejemplo de variables de entorno
├── .gitignore                      # Archivos ignorados por Git
├── index.js                        # Punto de entrada de la aplicación
├── package.json                    # Dependencias y scripts
└── README.md                       # Este archivo
```


## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Los endpoints protegidos requieren un token válido en el header `Authorization`. Los token estan configurados para durar 5 minutos

### Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Usar Token

```http
GET /api/products
Authorization: Bearer TU_TOKEN_AQUI
```

## 📡 Endpoints Principales

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/refresh` | Refrescar token | No |
| GET | `/auth/verify` | Verificar token | Sí |
| POST | `/auth/logout` | Cerrar sesión | Sí |

### Productos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Obtener todos los productos | No |
| GET | `/api/products/:id` | Obtener producto por ID | No |
| GET | `/api/products/category/:category` | Obtener por categoría | No |
| POST | `/api/products/create` | Crear producto | Sí |
| PUT | `/api/products/:id` | Actualizar producto | Sí |
| DELETE | `/api/products/:id` | Eliminar producto | Sí |

## 💾 Modelo de Datos

### Producto

```javascript
{
  "id": "string",              // ID único (auto-generado)
  "name": "string",            // Nombre del producto (requerido)
  "description": "string",     // Descripción del producto
  "price": number,             // Precio (requerido, > 0)
  "stock": number,             // Cantidad en stock (>= 0)
  "category": "string",        // Categoría del producto
  "imageUrl": "string",        // URL de la imagen
  "createdAt": "string",       // Fecha de creación (ISO 8601)
  "updatedAt": "string"        // Fecha de actualización (ISO 8601)
}
```

## 🧪 Ejemplos de Uso

### Crear un Producto

```bash
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "name": "Laptop HP",
    "description": "Laptop HP 15 pulgadas",
    "price": 899.99,
    "stock": 10,
    "category": "Electrónica"
  }'
```

### Obtener Todos los Productos

```bash
curl http://localhost:3000/api/products
```

### Actualizar un Producto

```bash
curl -X PUT http://localhost:3000/api/products/ID_PRODUCTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"price": 799.99, "stock": 15}'
```

## 💥 Manejo de Errores

La API maneja los siguientes códigos de estado HTTP:

- **200** - OK (Éxito)
- **201** - Created (Recurso creado)
- **400** - Bad Request (Datos inválidos)
- **401** - Unauthorized (No autenticado)
- **403** - Forbidden (Token inválido)
- **404** - Not Found (Recurso no encontrado)
- **500** - Internal Server Error (Error del servidor)

## Checklist de Pruebas

### Autenticación
- [✅] Login exitoso con credenciales correctas
- [✅] Login fallido con credenciales incorrectas
- [✅] Verificar token válido
- [✅] Verificar token inválido
- [✅] Verificar token expirado

### Productos - Lectura (Público)
- [✅] Obtener todos los productos
- [✅] Obtener producto por ID existente
- [✅] Obtener producto por ID inexistente

### Productos - Escritura (Protegido)
- [✅] Crear producto con token válido
- [✅] Crear producto sin token (debe fallar)
- [✅] Crear producto con datos inválidos (debe fallar)
- [✅] Actualizar producto con token válido
- [✅] Actualizar producto sin token (debe fallar)
- [✅] Eliminar producto con token válido
- [✅] Eliminar producto sin token (debe fallar)

### Manejo de Errores
- [✅] Ruta no encontrada (404)
- [ ] Error de servidor (500)
- [✅] Validación de datos


## 👨‍💻 Datos del Proyecto
#### Curso: API Rest con Node.js
#### Comición: 26132
#### Autor: Jorge Luis Poratti
#### Institución: Buenos Aires Aprende - Agencia de Habilidades para el Futuro
#### Repositorio: https://github.com/jlporatti/Proyecto_Final
