import { useState, useEffect } from "react";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Все");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Products"));
                const productsList = querySnapshot.docs.map(doc => {
                    console.log("Документ из Firestore:", doc.data()); // Проверяем, что Firestore отдает `media`
                    return { id: doc.id, ...doc.data() };
                });

                setProducts(productsList);
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const uniqueCategories = Array.from(
        new Set(products.map((p) => p.category?.trim().toLowerCase()))
    );

    const categories = ["Все", ...uniqueCategories];

    console.log("Категории:", categories); // Проверяем, что загружается
    const filteredProducts = selectedCategory === "Все"
        ? products
        : products.filter((p) => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase());

    console.log("Отфильтрованные товары:", filteredProducts);
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    if (loading) return <div className="text-white text-center mt-10">Загрузка...</div>;
    const subcategories = selectedCategory !== "Все"
        ? Array.from(
            new Set(
                products
                    .filter((p) => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase())
                    .map((p) => p.subcategory?.trim().toLowerCase())
            )
        )
        : [];
    return (
        <>
        <div className="p-6 bg-[#141414] min-h-screen text-white">
            <h1 className="text-3xl font-bold text-[#D7263D] mb-6 text-center">Все товары</h1>

            {/* Фильтр категорий */}
            <div className="flex justify-center gap-4 mb-6">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-lg font-semibold transition ${
                            selectedCategory === category ? "bg-[#D7263D] text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            {selectedCategory !== "Все" && subcategories.length > 0 && (
                <div className="flex justify-center gap-4 mb-6">
                    {subcategories.map((subcategory, index) => (
                        <button
                            key={index}
                            className="px-3 py-1 rounded-md text-md font-semibold transition bg-gray-600 text-white hover:bg-gray-500"
                        >
                            {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                        </button>
                    ))}
                </div>
            )}
            {/* Сетка товаров */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        className="bg-[#1F1F1F] p-4 rounded-lg shadow-lg relative"
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Слайдер изображений */}
                        {Array.isArray(product?.variants) && product.variants.length > 0 ? (
                            <Slider {...sliderSettings} className="rounded-md overflow-hidden">
                                {Array.isArray(product.variants[0]?.media) && product.variants[0].media.length > 0 ? (
                                    Array.from(
                                        new Set(
                                            product.variants[0].media.map(img => img.data) // Берем только уникальные `base64`
                                        )
                                    ).map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`image-${index}`}
                                            className="w-full h-64 object-cover rounded-lg mb-4"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300";
                                            }}
                                        />
                                    ))
                                ) : (
                                    <img src="https://via.placeholder.com/300" alt="Нет изображения" className="w-full h-40 object-cover rounded-md" />
                                )}
                            </Slider>
                        ) : (
                            <img src="https://via.placeholder.com/300" alt="Нет изображения" className="w-full h-40 object-cover rounded-md" />
                        )}





                        <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                        <p className="text-sm text-gray-400">{product.category}</p>
                        <p className="text-xl font-bold mt-2">
                            Цена: {product?.variants?.[0]?.price || product?.price || "Цена не указана"} ₸
                        </p>
                        <p className="text-sm text-gray-400">
                            В наличии: {product?.variants?.[0]?.stock || product?.stock || "Нет данных"}
                        </p>

                        {/* Кнопка редактирования */}
                        <Link to={`/edit-product/${product.id}`} className="block mt-3">
                            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                                Редактировать
                            </button>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ProductsPage;
