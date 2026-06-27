// // METODO DE CONEXION CON FIREBASE ADMIN SDK USANDO VARIABLES DE ENTORNO (DESARROLLO)

// const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
//   console.warn('⚠️  Firebase credentials not configured. Using mock mode.');
//   console.warn('   Por favor configure Firebase credentials en el archivo .env o use el JSON de cuenta de servicio.');
//   return null;
// }

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: privateKey,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   })
// });


// METODO DE CONEXION CON FIREBASE ADMIN SDK USANDO ARCHIVO JSON DE CUENTA DE SERVICIO (PRODUCCION)

// Importamos initializeApp y cert directamente desde el submódulo 'app'
import { initializeApp, cert } from 'firebase-admin/app';

// Importamos getFirestore desde el submódulo 'firestore'
import { getFirestore as getFirebaseFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

//Inicializamos la conexión con Firebase Admin SDK

export const initializeFirebase = async () => {
  try {
    const serviceAccount = await import('../../firebase-service-account.json', {
      with: { type: 'json' }
    });
    
    // Usamos la función 'cert()' que importamos arriba
    initializeApp({
      credential: cert(serviceAccount.default)
    });
    
    db = getFirebaseFirestore();
    
    console.log('✅ Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error.message);
    console.warn('⚠️  Corriendo en modo mock sin conexión a Firebase');
    return null;
  }
};

// Obtenemos la instancia de Firestore
export const getFirestore = () => {
  return db;
};

// Obtenemos la instancia de Firebase Admin
export const getAdmin = () => ({});

export default { initializeFirebase, getFirestore, getAdmin };
