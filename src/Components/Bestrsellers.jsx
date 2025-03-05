import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Анимация появления при скролле
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const BestsellersSlider = () => {
    const [products, setProducts] = useState([]);
    const [index, setIndex] = useState(0);
    const visibleProducts = 4;
    const [dragging, setDragging] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const storedProducts = localStorage.getItem("bestsellers");
                if (storedProducts) {
                    setProducts(JSON.parse(storedProducts));
                    return;
                }

                const querySnapshot = await getDocs(collection(db, "Products"));
                const fetchedProducts = querySnapshot.docs.map((doc) => {
                    const data = doc.data();

                    let image = "https://via.placeholder.com/400";
                    if (data.variants?.[0]?.media?.[0]?.data) {
                        image = data.variants[0].media[0].data;
                    }

                    let price = "0 ₸";
                    let oldPrice = null;
                    if (data.variants?.[0]?.price) {
                        price = `${data.variants[0].price} ₸`;
                        oldPrice = data.variants[0].oldPrice ? `${data.variants[0].oldPrice} ₸` : null;
                    }

                    return {
                        id: doc.id,
                        name: data.title,
                        price,
                        oldPrice,
                        discount: data.discount || null,
                        image,
                    };
                });

                setProducts(fetchedProducts);
                localStorage.setItem("bestsellers", JSON.stringify(fetchedProducts));
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error.message);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            controls.start("visible");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [controls]);

    const nextSlide = () => {
        if (products.length <= visibleProducts) return;
        setIndex((prev) => (prev + visibleProducts) % products.length);
    };

    const prevSlide = () => {
        if (products.length <= visibleProducts) return;
        setIndex((prev) => (prev - visibleProducts + products.length) % products.length);
    };

    return (
        <motion.section
            className="container mx-auto py-12 "
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
        >
            <h2 className="text-4xl font-extrabold text-center text-[#C51F5D] mb-8 tracking-wide">
                Бестселлеры
            </h2>

            <div className="relative flex items-center justify-center">
                {/* Кнопка Влево */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 z-10 bg-[#141D26] text-white p-3 rounded-full shadow-lg hover:bg-[#C51F5D] transition-all duration-300 hover:scale-110"
                    disabled={products.length <= visibleProducts}
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Карточки товаров */}
                <motion.div
                    className="overflow-hidden w-full px-6 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: -300, right: 300 }}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={(event, info) => {
                        setDragging(false);
                        if (info.offset.x < -100) {
                            nextSlide();
                        } else if (info.offset.x > 100) {
                            prevSlide();
                        }
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={index}
                            className="flex gap-6 justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            {products.length > 0 ? (
                                products
                                    .slice(index, index + visibleProducts)
                                    .concat(products.slice(0, Math.max(0, visibleProducts - (products.length - index))))
                                    .map((product) => (
                                        <motion.div
                                            key={product.id}
                                            className="relative bg-[#243447] p-5 rounded-xl shadow-lg w-[260px] text-center border border-gray-300 transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                                        >
                                            {/* Картинка товара */}
                                            <div className="relative overflow-hidden rounded-lg">
                                                {product.discount && (
                                                    <span className="absolute top-2 right-2 bg-[#C51F5D] text-white text-xs px-2 py-1 rounded-full shadow-md">
                                                        {product.discount}
                                                    </span>
                                                )}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>

                                            {/* Название товара */}
                                            <h3 className="text-lg font-semibold text-[#E2E2D2] mt-4 truncate">
                                                {product.name}
                                            </h3>

                                            {/* Цена */}
                                            <div className="text-[#C51F5D] font-bold text-xl mt-2">
                                                {product.price}{" "}
                                                {product.oldPrice && (
                                                    <span className="text-gray-400 line-through text-sm ml-2">
                                                        {product.oldPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">Загрузка товаров...</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Кнопка Вправо */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 z-10 bg-[#141D26] text-white p-3 rounded-full shadow-lg hover:bg-[#C51F5D] transition-all duration-300 hover:scale-110"
                    disabled={products.length <= visibleProducts}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </motion.section>
    );
};

export default BestsellersSlider;
