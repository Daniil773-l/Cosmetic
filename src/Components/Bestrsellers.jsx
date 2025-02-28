import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";



const products = [
    { name: "Маска для увлажнения и питания волос", price: "1230.00 руб", image: "https://via.placeholder.com/400" },
    { name: "Увлажняющая сыворотка для лица", price: "1180.00 руб", image: "https://via.placeholder.com/400" },
    { name: "Матирующая пудра для лица", price: "800.00 руб", image: "https://via.placeholder.com/400" },
    { name: "Кремовые жидкие румяна для лица", price: "1500.00 руб", image: "https://via.placeholder.com/400" },
    { name: "Помада-бальзам для губ с витамином E", price: "1870.00 руб", oldPrice: "1900.00 руб", image: "https://via.placeholder.com/400", discount: "-2%" }
];

const BestsellersSlider = () => {
    const [index, setIndex] = useState(0);
    const visibleProducts = 4;

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    return (
        <section className="container mx-auto py-16">
            <h2 className="text-4xl font-bold text-center text-[#141414] mb-12">Бестселлеры</h2>
            <div className="relative flex items-center">
                <button onClick={prevSlide} className="absolute left-0 z-10 bg-[#141414] text-white p-3 rounded-full shadow-md hover:bg-[#D7263D] transition">
                    <ChevronLeft size={24} />
                </button>

                <div className="overflow-hidden w-full px-10">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={index}
                            className="flex gap-8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            {products.slice(index, index + visibleProducts).map((product, i) => (
                                <div key={i} className="bg-[#F5F3F5] p-6 rounded-xl shadow-lg w-60 text-center">
                                    <div className="relative">
                                        {product.discount && (
                                            <span className="absolute top-2 right-2 bg-[#D7263D] text-white text-xs px-2 py-1 rounded-full">{product.discount}</span>
                                        )}
                                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#141414] mt-4">{product.name}</h3>
                                    <div className="text-[#D7263D] font-bold text-xl mt-2">
                                        {product.price} <span className="text-gray-400 line-through text-sm">{product.oldPrice}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button onClick={nextSlide} className="absolute right-0 z-10 bg-[#141414] text-white p-3 rounded-full shadow-md hover:bg-[#D7263D] transition">
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
};

export default BestsellersSlider;
