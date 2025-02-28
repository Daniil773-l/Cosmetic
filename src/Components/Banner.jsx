import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Banner1 from "../asets/img/Banner1.webp";
import Banner2 from "../asets/img/Banner2.webp";
import Banner3 from "../asets/img/Banner3.webp";
const slides = [
    { text: "Совершенство и стиль", subtext: "Премиальная косметика для идеального образа", image: Banner1 },
    { text: "Новая коллекция косметики", subtext: "Элегантность в каждой детали", image: Banner2 },
    { text: "Сезонные скидки до 30%", subtext: "Эксклюзивные предложения на лучшие продукты", image: Banner3 },
];

const HeroBanner = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[800px] overflow-hidden flex flex-col items-center justify-center">
            <AnimatePresence>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-cover bg-center text-center"
                    style={{ backgroundImage: `url(${slides[index].image})` }}
                >
                    <div className="absolute inset-0 bg-[141414] backdrop-blur-sm"></div>
                    <div className="relative max-w-2XL text-[#F5F3F5] z-10 p-8 bg-[141414]rounded-2xl shadow-2xl  backdrop-blur-md">
                        <h2 className="text-6xl font-extrabold tracking-wide drop-shadow-xl animate-fadeIn">{slides[index].text}</h2>
                        <p className="text-lg mt-3 opacity-90 font-light animate-slideUp">{slides[index].subtext}</p>
                    </div>

                    {/* Email Input */}
                    <div className="relative mt-8 w-100 flex items-center rounded-full bg-[#F5F3F5] overflow-hidden shadow-lg ">
                        <input
                            type="email"
                            placeholder="Ваш e-mail"
                            className="flex-grow px-6 py-4 text-[#141414] focus:outline-none bg-transparent font-medium"
                        />
                        <button className="bg-[#ABACAD] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#ABACAD] ">
                            Подписаться
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/50 p-4 rounded-full text-white hover:bg-black/70 transition-all hover:scale-110"
                    onClick={() => setIndex(index === 0 ? slides.length - 1 : index - 1)}>
                <ChevronLeft size={36} />
            </button>
            <button className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/50 p-4 rounded-full text-white hover:bg-black/70 transition-all hover:scale-110"
                    onClick={() => setIndex((index + 1) % slides.length)}>
                <ChevronRight size={36} />
            </button>
        </div>
    );
};

export default HeroBanner;
