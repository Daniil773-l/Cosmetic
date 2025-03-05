import { useEffect, useState } from "react";
import { useAuth } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../config/FirebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../Components/Sidebar";
import { ShoppingCart, Package, ChevronRight, Star } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserHomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        if (!user) {
            toast.error("Ошибка: пользователь не аутентифицирован");
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) setUserData(userSnap.data());
                else toast.error("Пользователь не найден в базе данных");
            } catch (error) {
                toast.error("Ошибка получения данных пользователя");
            }
        };

        fetchUserData();
    }, [user]);

    return (
        <div className="flex bg-gradient-to-br from-[#141D26] to-[#1E2A38] min-h-screen text-[#E2E2D2]">
            <Sidebar />
            <main className="ml-64 flex-1 pt-16 px-10">
                {/* Приветствие */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <h2 className="text-4xl font-extrabold tracking-wide text-[#C51F5D]">
                        Добро пожаловать, {userData?.username || "Пользователь"}!
                    </h2>
                    <p className="text-lg text-gray-400">Ваш email: {user?.email}</p>
                </motion.div>

                {/* Быстрый доступ */}
                <section className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        🚀 Быстрый доступ
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#243447] p-6 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 shadow-lg border border-[#C51F5D]/50 hover:bg-[#C51F5D]/20"
                            onClick={() => navigate("/cart")}
                        >
                            <ShoppingCart className="text-[#C51F5D]" />
                            <h4 className="text-lg font-semibold">Корзина</h4>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#243447] p-6 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 shadow-lg border border-[#C51F5D]/50 hover:bg-[#C51F5D]/20"
                            onClick={() => navigate("/profile")}
                        >
                            <h4 className="text-lg font-semibold">Профиль</h4>
                        </motion.div>
                    </div>
                </section>

                {/* Персональные рекомендации */}
                <section className="mt-12">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        💡 Персональные рекомендации
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#243447] p-6 rounded-xl text-center cursor-pointer transition-all shadow-lg border border-[#C51F5D]/50 hover:bg-[#C51F5D]/20"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                                <h4 className="text-lg font-semibold mt-2">{product.name}</h4>
                                <p className="text-[#C51F5D] font-bold">{product.price} ₸</p>
                                <Star className="mt-2 text-[#C51F5D]" />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserHomePage;
