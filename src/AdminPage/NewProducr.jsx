import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../config/FirebaseConfig";
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Trash, Upload, Edit } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Modal from "react-modal";
import AdminHeader from "../Components/HeaderAdmin";
const AddProduct = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [previewMedia, setPreviewMedia] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: "",
        brand: "",
        descriptionbrand: "", // ✅ Описание бренда
        countryBrand: "", // ✅ Страна бренда
        category: "",
        subcategory: "",
        description: "",
        structure: "", // ✅ Состав

        // ✅ Подробные характеристики
        characteristics: {
            "Тип продукта": "",
            Финиш: "",
            "Для кого": "",
            "Область применения": "",
            "Тип кожи": "",
            "Дополнительная информация": "",
        },

        price: "",
        stock: "",
        variants: [], // 🔥 Добавляем массив оттенков (цвета + медиа)
    });


    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("🔹 Пользователь авторизован:", user.uid);
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.role === "admin") {
                        setIsAdmin(true);
                    } else {
                        toast.error("У вас нет доступа к админ-панели!");
                        setIsAdmin(false);
                    }
                } else {
                    toast.error("Пользователь не найден в Firestore!");
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAdmin) {
            const fetchProducts = async () => {
                try {
                    const querySnapshot = await getDocs(collection(db, "Products"));
                    const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setProducts(productsList);
                } catch (error) {
                    toast.error("Ошибка загрузки товаров: " + error.message);
                }
            };
            fetchProducts();
        }
    }, [isAdmin]);



    const handleAddProduct = async () => {
        try {
            const newId = Date.now().toString(); // 🔥 Уникальный ID товара

            const newProductData = {
                id: newId,
                ...newProduct,
                price: Number(newProduct.price) || 0,
                stock: Number(newProduct.stock) || 0,
            };

            // ✅ Добавляем в Firestore
            const docRef = await addDoc(collection(db, "Products"), newProductData);
            console.log("✅ Товар добавлен с ID:", docRef.id);

            // ✅ Добавляем товар в локальный state
            setProducts([...products, { id: docRef.id, ...newProductData }]);

            // 🔄 Сбрасываем форму
            setNewProduct({
                title: "",
                brand: "",
                descriptionbrand: "",
                countryBrand: "",
                category: "",
                subcategory: "",
                description: "",
                structure: "",
                characteristics: {
                    "Тип продукта": "",
                    Финиш: "",
                    "Для кого": "",
                    "Область применения": "",
                    "Тип кожи": "",
                    "Дополнительная информация": "",
                },
                price: "",
                stock: "",
                variants: [],
            });

            setPreviewMedia([]);

            toast.success("✅ Товар успешно добавлен!");
        } catch (error) {
            toast.error("❌ Ошибка добавления в Firestore: " + error.message);
        }
    };


    /**
     * 📌 Добавление нового оттенка (цвета) в `variants`
     */
    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [
                ...newProduct.variants,
                {
                    colorName: "",  // 🔥 Название цвета (например, "Красный")
                    colorHex: "#000000",  // 🔥 HEX-код цвета (по умолчанию черный)
                    colorNumber: "",  // 🔥 Номер цвета (например, "270")
                    price: newProduct.price,
                    stock: newProduct.stock,
                    media: [],
                },
            ],
        });
    };


    /**
     * 📌 Обновление данных оттенка (цвета)
     */
    const handleVariantChange = (index, key, value) => {
        setNewProduct(prevState => {
            const updatedVariants = [...prevState.variants];
            updatedVariants[index] = { ...updatedVariants[index], [key]: value };
            return { ...prevState, variants: updatedVariants };
        });
    };


    /**
     * 📌 Загрузка фото/видео для оттенка
     */
    const handleVariantMediaUpload = (event, index) => {
        const files = Array.from(event.target.files);
        const newMedia = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result; // Конвертация в Base64

                newMedia.push({ type: file.type, data: base64String });

                // ✅ Обновляем `newProduct.variants[index].media`
                setNewProduct(prevState => {
                    const updatedVariants = [...prevState.variants];
                    updatedVariants[index] = {
                        ...updatedVariants[index],
                        media: [...updatedVariants[index].media, { type: file.type, data: base64String }],
                    };
                    return { ...prevState, variants: updatedVariants };
                });

                // ✅ Добавляем превью
                setPreviewMedia(prev => [...prev, { type: file.type, data: base64String }]);
            };

            reader.readAsDataURL(file); // Читаем как Base64
        });
    };




    /**
     * 📌 Удаление медиа у оттенка
     */
    const removeVariantMedia = (variantIndex, mediaIndex) => {
        setNewProduct(prevState => {
            const updatedVariants = [...prevState.variants];
            updatedVariants[variantIndex].media = updatedVariants[variantIndex].media.filter((_, i) => i !== mediaIndex);
            return { ...prevState, variants: updatedVariants };
        });
    };


    /**
     * 📌 Удаление оттенка из списка
     */
    const removeVariant = (index) => {
        setNewProduct({
            ...newProduct,
            variants: newProduct.variants.filter((_, i) => i !== index),
        });
    };


    const handleEditProduct = async () => {
        if (!editingProduct) return;

        try {
            const productRef = doc(db, "Products", editingProduct.id);

            await updateDoc(productRef, {
                ...editingProduct,
                price: Number(editingProduct.price) || 0,
                stock: Number(editingProduct.stock) || 0,
            });

            setProducts(products.map(p => (p.id === editingProduct.id ? editingProduct : p)));
            setEditingProduct(null);
            toast.success("✅ Товар успешно обновлён!");
        } catch (error) {
            toast.error("Ошибка обновления: " + error.message);
        }
    };
    const handleDeleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, "Products", id)); // Удаляем товар из Firestore
            setProducts(products.filter((p) => p.id !== id)); // Удаляем товар из состояния
            toast.success("✅ Товар успешно удалён!");
        } catch (error) {
            toast.error("❌ Ошибка удаления: " + error.message);
        }
    };

    return (
        <>
            <AdminHeader/>
            <div className="min-h-screen bg-[#1F1F1F] p-8 text-white">
                <div className="mt-10 max-w-3xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-700">
                    <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Добавить товар</h2>

                    <div className="space-y-6">
                        {[
                            { label: "Название", key: "title", type: "text" },
                            { label: "Бренд", key: "brand", type: "text" },
                            { label: "Описание бренда", key: "descriptionbrand", type: "textarea" },
                            { label: "Страна бренда", key: "countryBrand", type: "text" },
                            { label: "Категория", key: "category", type: "text" },
                            { label: "Подкатегория", key: "subcategory", type: "text" },
                            { label: "Состав", key: "structure", type: "textarea" },
                            { label: "Описание", key: "description", type: "textarea" },
                        ].map(({ label, key, type }) => (
                            <div key={key} className="space-y-2">
                                <label className="block text-gray-400 text-sm font-medium">{label}</label>
                                {type === "textarea" ? (
                                    <textarea
                                        placeholder={`Введите ${label.toLowerCase()}`}
                                        value={newProduct[key]}
                                        onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-600 focus:ring focus:ring-blue-500"
                                    ></textarea>
                                ) : (
                                    <input
                                        type={type}
                                        placeholder={`Введите ${label.toLowerCase()}`}
                                        value={newProduct[key]}
                                        onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                                        className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-600 focus:ring focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Подробные характеристики */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Характеристики</h3>
                            {Object.keys(newProduct.characteristics).map((key) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-gray-400 text-sm font-medium">{key}</label>
                                    <input
                                        type="text"
                                        placeholder={`Введите значение для ${key}`}
                                        value={newProduct.characteristics[key]}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                characteristics: {
                                                    ...newProduct.characteristics,
                                                    [key]: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-600 focus:ring focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Оттенки */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white">Оттенки</h3>
                            {newProduct.variants.map((variant, index) => (
                                <div key={index} className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                                    {/* Цвет и HEX */}
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium">Цвет (название)</label>
                                        <input
                                            type="text"
                                            placeholder="Введите название цвета"
                                            value={variant.color}
                                            onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:ring focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium">HEX-код</label>
                                        <input
                                            type="color"
                                            value={variant.hex || "#ffffff"} // По умолчанию белый цвет
                                            onChange={(e) => handleVariantChange(index, "hex", e.target.value)}
                                            className="w-full p-1 bg-gray-700 rounded-lg text-white border border-gray-600"
                                        />
                                    </div>

                                    {/* Цена и Количество */}
                                    {[
                                        { label: "Цена", key: "price", type: "number" },
                                        { label: "Количество", key: "stock", type: "number" },
                                    ].map(({ label, key, type }) => (
                                        <div key={key}>
                                            <label className="block text-gray-400 text-sm font-medium">{label}</label>
                                            <input
                                                type={type}
                                                placeholder={label}
                                                value={variant[key]}
                                                onChange={(e) => handleVariantChange(index, key, e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:ring focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}

                                    {/* Загрузка фото / видео */}
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium">Фото / Видео</label>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp, image/svg, video/mp4"
                                            multiple
                                            onChange={(e) => handleVariantMediaUpload(e, index)}
                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600"
                                        />
                                    </div>

                                    {/* Превью загруженных фото / видео */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variant.media.map((media, idx) => (
                                            <div key={idx} className="relative w-24 h-24 border border-gray-500 rounded-md overflow-hidden">
                                                {media.type.startsWith("image/") ? (
                                                    <img src={media.data} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <video className="w-full h-full object-cover" controls>
                                                        <source src={media.data} type={media.type} />
                                                    </video>
                                                )}
                                                {/* Кнопка удаления файла */}
                                                <button
                                                    onClick={() => removeVariantMedia(index, idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleAddVariant}
                                className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-md text-white font-semibold"
                            >
                                ➕ Добавить оттенок
                            </button>
                        </div>

                        {/* Кнопка добавления */}
                        <button
                            onClick={handleAddProduct}
                            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-md text-white font-semibold text-lg"
                        >
                            ✅ Добавить товар
                        </button>
                    </div>
                </div>


        </div>
        </>

    );
};

export default AddProduct;
