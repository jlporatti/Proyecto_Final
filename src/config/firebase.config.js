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


// Configuración de Firebase Admin SDK compatible con Vercel y modo local
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore as getFirebaseFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let db = null;

export const initializeFirebase = async () => {
  try {
    let serviceAccount = null;

    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      serviceAccount = {
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    } else {
      const filePath = path.resolve(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(filePath)) {
        serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    }

    if (!serviceAccount) {
      throw new Error('Firebase credentials not found. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    db = getFirebaseFirestore();
    console.log('✅ Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error.message);
    console.warn('⚠️ Corriendo en modo mock sin conexión a Firebase');
    return null;
  }
};

export const getFirestore = () => db;
export const getAdmin = () => ({});
export default { initializeFirebase, getFirestore, getAdmin };
