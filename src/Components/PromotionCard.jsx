import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../config/FirebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import PromotionFilters from "./PromotionFilters"; // Подключаем фильтры

const LOCAL_STORAGE_KEY = "promotions_cache";

const Promotions = () => {
    const [allPromotions, setAllPromotions] = useState([]); // Все акции
    const [filteredPromotions, setFilteredPromotions] = useState([]); // Отфильтрованные акции

    useEffect(() => {
        // Загружаем данные из localStorage
        const cachedPromotions = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedPromotions) {
            const parsedPromotions = JSON.parse(cachedPromotions);
            setAllPromotions(parsedPromotions);
            setFilteredPromotions(parsedPromotions);
        }

        // Функция загрузки данных из Firestore
        const fetchPromotions = async () => {
            try {
                const promotionsRef = collection(db, "Promotions");
                const promotionsQuery = query(promotionsRef, orderBy("startDate", "asc"), limit(10));
                const querySnapshot = await getDocs(promotionsQuery);

                const fetchedPromotions = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (fetchedPromotions.length > 0) {
                    setAllPromotions(fetchedPromotions);
                    setFilteredPromotions(fetchedPromotions);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedPromotions));
                }
            } catch (error) {
                console.error("Ошибка загрузки акций:", error);
            }
        };

        fetchPromotions();
    }, []);

    return (
        <section className="bg-[#141414] min-h-screen flex flex-col items-center py-12 px-6">
            {/* Фильтры с передачей функций */}
            <PromotionFilters promotions={allPromotions} setFilteredPromotions={setFilteredPromotions} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 w-full max-w-6xl">
                {filteredPromotions.map((promo, index) => {
                    const defaultRotation = index % 2 === 0 ? 3 : -3; // Начальный наклон
                    return (
                        <motion.div
                            key={promo.id}
                            className="relative bg-[#141414] rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-3xl"
                            initial={{ rotate: defaultRotation }}
                            whileHover={{ rotate: 0, scale: 1.07 }}
                            animate={{ rotate: defaultRotation }}
                        >
                            <div className="relative">
                                <img
                                    src={promo.imageBase64}
                                    alt={promo.title}
                                    className="w-full h-80 object-cover rounded-t-3xl opacity-95"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent"></div>

                                {/* Проверяем, есть ли startDate и endDate перед рендерингом блока с датами */}
                                {promo.startDate && promo.endDate && (
                                    <div className="absolute top-6 left-6 bg-red-600 text-white text-lg px-5 py-2 rounded-full shadow-lg font-semibold">
                                        {promo.startDate} - {promo.endDate}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 text-[#ABACAD] text-center">
                                <h3 className="text-3xl font-extrabold">{promo.title}</h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default Promotions;
