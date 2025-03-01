import { Mail, Instagram, Facebook, Twitter, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#141414] text-white py-12 mt-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ЛОГОТИП и КОРОТКО О БРЕНДЕ */}
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#D7263D]">MOON</h2>
                        <p className="text-gray-400 mt-3 text-sm">
                            Натуральная косметика для заботы о вашей коже.
                            Мы используем только лучшие ингредиенты для здоровья и красоты.
                        </p>
                    </div>

                    {/* НАВИГАЦИЯ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Навигация</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li><a href="/" className="hover:text-white transition">Главная</a></li>
                            <li><a href="/catalog" className="hover:text-white transition">Каталог</a></li>
                            <li><a href="/about" className="hover:text-white transition">О нас</a></li>
                            <li><a href="/contacts" className="hover:text-white transition">Контакты</a></li>
                        </ul>
                    </div>

                    {/* КОНТАКТЫ И СОЦСЕТИ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Контакты</h3>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <Phone size={16} /> +7 (999) 123-45-67
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 text-sm mt-2">
                            <Mail size={16} /> info@cosmeticstore.com
                        </p>

                        {/* СОЦСЕТИ */}
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-[#D7263D] transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#D7263D] transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#D7263D] transition">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* ПОДПИСКА НА РАССЫЛКУ */}
                <div className="mt-10 border-t border-gray-600 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-400 text-sm">© {new Date().getFullYear()} CosmeticStore. Все права защищены.</p>
                    <form className="flex w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Ваш email"
                            className="px-4 py-2 text-black rounded-l-md w-full md:w-64"
                        />
                        <button
                            type="submit"
                            className="bg-[#D7263D] text-white px-6 py-2 rounded-r-md hover:bg-red-700 transition"
                        >
                            Подписаться
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
