import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_kVry8N8T7WZoMRG8hX-lwiCftcGmqMw",
  authDomain: "wedding-hub-ccb46.firebaseapp.com",
  projectId: "wedding-hub-ccb46",
  storageBucket: "wedding-hub-ccb46.firebasestorage.app",
  messagingSenderId: "210598238550",
  appId: "1:210598238550:web:db519f68eb3f172eab1ef7",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export default app;
