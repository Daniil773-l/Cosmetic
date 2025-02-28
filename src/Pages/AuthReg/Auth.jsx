import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db, googleProvider } from "../../config/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup , setPersistence, browserSessionPersistence} from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // 🔄 Хук для перенаправления
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // 🚀 Регистрация через Email/Password
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email.includes("@")) {
            toast.error("Введите корректный email!");
            return;
        }
        if (password.length < 6) {
            toast.error("Пароль должен быть минимум 6 символов!");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 📌 Сохраняем пользователя в Firestore с ролью user
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                role: "user",
            });

            toast.success("Вы успешно зарегистрированы!");
            setIsLogin(true);
        } catch (error) {
            toast.error("Ошибка регистрации: " + error.message);
        }
    };

    // 🔥 Авторизация через Email/Password
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 📌 Проверяем роль в Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                toast.success("Вы успешно вошли!");

                // 🎯 Перенаправляем по роли
                if (userData.role === "admin") {
                    navigate("/admin"); // 👉 Перенос в админку
                } else {
                    navigate("/"); // 👉 Обычные пользователи остаются на главной
                }
            } else {
                toast.error("Пользователь не найден!");
            }
        } catch (error) {
            toast.error("Ошибка входа: " + error.message);
        }
    };

    // 🔥 Авторизация через Google
    const handleGoogleLogin = async (e) => {
        e.preventDefault();

        try {
            await setPersistence(auth, browserSessionPersistence);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (!user) {
                throw new Error("Не удалось получить данные пользователя.");
            }

            // Проверяем, есть ли пользователь в Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            let role = "user"; // 👤 По умолчанию обычный пользователь
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    username: user.displayName || "Пользователь",
                    email: user.email,
                    role: role,
                    createdAt: new Date(),
                });
            } else {
                role = userSnap.data().role;
            }

            toast.success("Вы успешно вошли через Google!");

            // 🎯 Перенаправляем по роли
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Ошибка Google авторизации:", error.message);
            toast.error("Ошибка Google авторизации: " + error.message);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-[#141414]">
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="bg-[#F5F3F5] shadow-2xl rounded-2xl p-10 w-[600px] text-center relative overflow-hidden"
            >
                {/* Кнопки переключения */}
                {/* Кнопки переключения */}
                <div className="relative flex justify-center mb-6 ">
                    <button
                        className={`relative z-10 text-lg font-semibold px-6 py-2 rounded-lg transition duration-300 ${
                            isLogin ? "bg-[#D7263D] text-white" : "text-[#D7263D] hover:bg-[#D7263D]/20"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Вход
                    </button>
                    <button
                        className={`relative z-10 text-lg font-semibold px-6 py-2 rounded-lg transition duration-300 ${
                            !isLogin ? "bg-[#D7263D] text-white" : "text-[#D7263D] hover:bg-[#D7263D]/20"
                        }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Регистрация
                    </button>
                </div>


                <motion.div
                    key={isLogin ? "login" : "register"}
                    initial={{ x: isLogin ? 50 : -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isLogin ? -50 : 50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <form className="relative">
                        {!isLogin && (
                            <div className="relative mb-4">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#141414]" />
                                <input
                                    type="text"
                                    placeholder="Имя"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 p-3 rounded-lg bg-[#ABACAD] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D7263D]"
                                />
                            </div>
                        )}
                        <div className="relative mb-4">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#141414]" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 rounded-lg bg-[#ABACAD] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D7263D]"
                            />
                        </div>
                        <div className="relative mb-6">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#141414]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-3 rounded-lg bg-[#ABACAD] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D7263D]"
                            />
                            {showPassword ? (
                                <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer  hover:text-[#D7263D]" onClick={() => setShowPassword(false)} />
                            ) : (
                                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer  hover:text-[#D7263D]" onClick={() => setShowPassword(true)} />
                            )}
                        </div>
                        <div className="relative mb-6">

                            <div className="relative mb-6">
                                {!isLogin && (
                                    <div className="relative">
                                        {/* Иконка замка */}
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#141414]" />

                                        {/* Поле ввода пароля */}
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Подтвердите пароль"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 p-3 rounded-lg bg-[#ABACAD] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#D7263D]"
                                        />

                                        {/* Кнопка-глазик для показа пароля */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#141414] hover:text-[#D7263D] transition duration-300"
                                        >
                                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                        <motion.button onClick={isLogin ? handleLogin : handleRegister} className="w-full bg-[#D7263D] text-white py-3 rounded-lg mb-4">
                            {isLogin ? "Войти" : "Зарегистрироваться"}
                        </motion.button>
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 transition"
                        >
                            <FcGoogle size={24} /> Войти через Google
                        </button>

                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
