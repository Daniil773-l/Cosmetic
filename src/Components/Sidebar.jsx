import { useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Home, Tag } from "lucide-react";
import { useAuth } from "../config/AuthContext";
import { motion } from "framer-motion";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <aside className="bg-[#243447] w-64 h-screen fixed top-0 left-0 flex flex-col items-center py-10 shadow-xl">
            {/* Логотип */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-extrabold text-[#E2E2D2] mb-12"
            >
                MOON
            </motion.h1>

            {/* Навигационные кнопки */}
            <nav className="flex flex-col gap-6 w-full px-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-4 text-[#E2E2D2] text-lg font-medium hover:text-[#C51F5D] transition duration-300"
                >
                    <Home size={24} />
                    Главная
                </button>
                <button
                    onClick={() => navigate("/promotions")}
                    className="flex items-center gap-4 text-[#E2E2D2] text-lg font-medium hover:text-[#C51F5D] transition duration-300"
                >
                    <Tag size={24} />
                    Акции
                </button>
                <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-4 text-[#E2E2D2] text-lg font-medium hover:text-[#C51F5D] transition duration-300"
                >
                    <ShoppingCart size={24} />
                    Корзина
                </button>
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-4 text-[#E2E2D2] text-lg font-medium hover:text-[#C51F5D] transition duration-300"
                >
                    <User size={24} />
                    Профиль
                </button>
            </nav>

            {/* Выход */}
            <button
                onClick={() => {
                    logout();
                    navigate("/login");
                }}
                className="mt-auto mb-6 text-[#E2E2D2] hover:text-[#C51F5D] transition duration-300 flex items-center gap-4"
            >
                <LogOut size={24} />
                Выйти
            </button>
        </aside>
    );
};

export default Sidebar;
