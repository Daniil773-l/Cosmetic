import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Индикатор загрузки

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userRef = doc(db, "users", firebaseUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: userSnap.data().role, // 📌 Устанавливаем роль
                        });
                    } else {
                        console.warn("Пользователь не найден в Firestore, но аутентифицирован.");
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: "user", // 🔹 По умолчанию даем роль "user"
                        });
                    }
                } catch (error) {
                    console.error("Ошибка загрузки данных пользователя:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false); // ✅ Отключаем индикатор загрузки
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {!loading && children} {/* ✅ Показываем контент только после загрузки */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
