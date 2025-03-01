import { Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Package, Users } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const AdminHeader = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Перенаправляем на страницу входа после выхода
        } catch (error) {
            console.error("Ошибка выхода:", error.message);
        }
    };

    return (
        <header className="bg-[#1F1F1F] text-white shadow-lg py-4 px-6 flex items-center justify-between">
            {/* Логотип */}
            <h1 className="text-2xl font-bold text-[#D7263D]">Админ-Панель</h1>

            {/* Навигация */}
            <nav className="hidden md:flex space-x-6">
                <Link to="/adminproducts" className="flex items-center gap-2 hover:text-[#D7263D] transition">
                    <Package size={20} /> Товары
                </Link>
                <Link to="/newproducts" className="flex items-center gap-2 hover:text-[#D7263D] transition">
                    <Users size={20} /> Добавить новый товар
                </Link>
                <Link to="/newpromotion" className="flex items-center gap-2 hover:text-[#D7263D] transition">
                    <Users size={20} />Добавление акций
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-2 hover:text-[#D7263D] transition">
                    <LayoutDashboard size={20} /> Настройки
                </Link>
            </nav>

            {/* Кнопка выхода */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#D7263D] px-4 py-2 rounded-lg text-white hover:bg-[#B51E2E] transition"
            >
                <LogOut size={20} /> Выйти
            </button>
        </header>
    );
};

export default AdminHeader;
