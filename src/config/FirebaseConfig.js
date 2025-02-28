import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 🔥 Добавляем Storage
import { getAnalytics, isSupported } from "firebase/analytics";

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyArwNPMYkEaWbZUgvy8nsXrVjR3EPM6w6o",
    authDomain: "cosmetics-12902.firebaseapp.com",
    projectId: "cosmetics-12902",
    storageBucket: "cosmetics-12902.appspot.com",
    messagingSenderId: "823868934992",
    appId: "1:823868934992:web:747bb0e348d59d6cba7a55",
    measurementId: "G-BS2VS52ZLF"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // 🔥 Добавляем Storage
const googleProvider = new GoogleAuthProvider();

// Проверяем, поддерживается ли analytics в браузере
let analytics = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { app, auth, db, storage, analytics, googleProvider }; // 🔥 Экспортируем Storage
