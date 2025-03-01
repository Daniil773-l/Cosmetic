import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PromotionFilters = ({ promotions = [], setFilteredPromotions }) => {
    const [activeFilters, setActiveFilters] = useState([]); // Массив выбранных фильтров
    const [displayCount, setDisplayCount] = useState(promotions.length);
    const [prevCount, setPrevCount] = useState(promotions.length);

    const filters = [
        { label: "анонс", value: "анонс" },
        { label: "промокод", value: "промокод" },
        { label: "скидка", value: "скидка" },
        { label: "клиентские дни", value: "клиентские дни" },
        { label: "подарок", value: "подарок" },
    ];

    const handleFilterClick = (filterValue) => {
        let updatedFilters;

        if (activeFilters.includes(filterValue)) {
            updatedFilters = activeFilters.filter((filter) => filter !== filterValue); // Убираем фильтр, если он уже выбран
        } else {
            updatedFilters = [...activeFilters, filterValue]; // Добавляем новый фильтр
        }

        setActiveFilters(updatedFilters);

        // Фильтруем акции: если выбрано что-то, оставляем только подходящие
        let filteredPromos;
        if (updatedFilters.length === 0) {
            filteredPromos = promotions; // Если ничего не выбрано, показываем все
        } else {
            filteredPromos = promotions.filter((promo) =>
                updatedFilters.includes(promo.category?.trim().toLowerCase())
            );
        }

        setFilteredPromotions(filteredPromos);

        // Анимация смены числа
        setPrevCount(displayCount);
        setDisplayCount(filteredPromos.length);
    };

    return (
        <section className="bg-[#141414] text-white pt-24 pb-12 px-6 flex flex-col items-center">
            {/* Динамическое количество акций с FLIP-анимацией */}
            <h2 className="text-5xl font-extrabold text-white tracking-wide flex items-center">
                акции/
                <div className="relative w-[40px] h-[50px] ml-2 overflow-hidden">
                    <AnimatePresence>
                        {/* Старая цифра уходит вверх */}
                        <motion.span
                            key={`prev-${prevCount}`}
                            initial={{ rotateX: 0 }}
                            animate={{ rotateX: 90, opacity: 0 }}
                            exit={{ rotateX: 90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-400 font-semibold"
                        >
                            {prevCount}
                        </motion.span>

                        {/* Новая цифра появляется снизу */}
                        <motion.span
                            key={`new-${displayCount}`}
                            initial={{ rotateX: -90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            exit={{ rotateX: -90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-400 font-semibold"
                        >
                            {displayCount}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </h2>

            {/* Фильтры */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                    onClick={() => {
                        setActiveFilters([]); // Сбрасываем фильтры
                        setFilteredPromotions(promotions);
                        setPrevCount(displayCount);
                        setDisplayCount(promotions.length);
                    }}
                    className={`px-6 py-2 rounded-full border text-lg font-medium transition-all tracking-wide ${
                        activeFilters.length === 0
                            ? "bg-[#D7263D] border-[#D7263D] text-white shadow-md scale-105"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-400 hover:text-white"
                    }`}
                >
                    все акции
                </button>

                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterClick(filter.value)}
                        className={`px-6 py-2 rounded-full border text-lg font-medium transition-all tracking-wide
                        ${
                            activeFilters.includes(filter.value)
                                ? "bg-[#D7263D] border-[#D7263D] text-white shadow-md scale-105"
                                : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-400 hover:text-white"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default PromotionFilters;
