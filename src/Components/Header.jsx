import { useState } from "react";
import { Search, ShoppingCart, User, Menu, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CatalogDropdownd from "./CatalogDropdownd";
import { Link } from "react-router-dom"

const Header = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="bg-[#141414] text-white h-20 flex items-center justify-between px-6 md:px-12 shadow-lg fixed w-full top-0 z-[100] backdrop-blur-md">
            {/* Бургер-меню для мобильных устройств */}
            <button className="md:hidden text-[#D9D4D1]" onClick={() => setMenuOpen(!menuOpen)}>
                <Menu size={32} />
            </button>

            {/* Навигация */}
            <nav className={`absolute md:static top-full left-0 w-full md:w-auto bg-[#3D444B] md:bg-transparent flex flex-col md:flex-row gap-6 md:gap-12 p-6 md:p-0 transition-all duration-300 ${menuOpen ? 'block' : 'hidden md:flex'}`}>
                <a href="#" className="text-[#ABACAD] hover:text-[#D7263D] transition duration-300">главная</a>
                <CatalogDropdownd/>
                <a href="#" className="text-[#ABACAD] hover:text-[#D7263D] transition duration-300">бренды</a>
                <Link to="/акции" className="text-[#ABACAD] hover:text-[#D7263D] transition duration-300">акции</Link>
                <a href="#" className="text-[#ABACAD] hover:text-[#D7263D] transition duration-300">контакты</a>
            </nav>

            {/* Логотип по центру */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F3F5] tracking-wider absolute left-1/2 transform -translate-x-1/2">
                MOON
            </h1>

            {/* Поиск, профиль и корзина справа */}
            <div className="flex items-center gap-4 md:gap-6 relative">
                {/* Анимированный поиск */}
                <motion.div
                    animate={{ width: searchOpen ? "14rem" : "0rem", opacity: searchOpen ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute right-12 md:right-20 bg-[#1F1F1F] text-[#ABACAD] border border-[#AEC0C2] rounded-lg overflow-hidden shadow-lg"
                >
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="w-full p-2 md:p-3 bg-transparent focus:outline-none text-lg font-medium"
                    />
                </motion.div>

                <Search
                    className="cursor-pointer text-[#ABACAD] hover:text-[#D7263D] transition duration-300 transform hover:scale-125"
                    onClick={() => setSearchOpen(!searchOpen)}
                />
                <User
                    className="cursor-pointer text-[#ABACAD] hover:text-[#D7263D] transition duration-300 transform hover:scale-125"
                    onClick={() => navigate("/регистрация")}
                />
                <ShoppingCart className="cursor-pointer text-[#ABACAD] hover:text-[#D7263D] transition duration-300 transform hover:scale-125" />
            </div>
        </header>
    );
};

export default Header;
