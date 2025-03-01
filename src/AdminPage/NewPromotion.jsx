import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { db } from "../config/FirebaseConfig"; // 🔥 Импорт Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const monthNames = {
    "января": "01", "февраля": "02", "марта": "03", "апреля": "04",
    "мая": "05", "июня": "06", "июля": "07", "августа": "08",
    "сентября": "09", "октября": "10", "ноября": "11", "декабря": "12"
};

const AddPromotion = () => {
    const [title, setTitle] = useState("");
    const [secondTitle, setSecondTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const parseDate = (dateStr) => {
        if (!dateStr.trim()) return null; // Дата необязательная, если пустая — возвращаем null
        const parts = dateStr.trim().split(" ");
        if (parts.length !== 2) return null;

        const [day, monthName] = parts;
        const month = monthNames[monthName.toLowerCase()];
        if (!month) return null;

        const currentYear = new Date().getFullYear();
        return `${currentYear}-${month}-${day.padStart(2, "0")}`;
    };

    const handleSubmit = async () => {
        console.log("📤 Попытка добавить акцию...");

        const formattedStartDate = parseDate(startDate);
        const formattedEndDate = parseDate(endDate);

        if (!title || !secondTitle || !category || !description || !imageBase64) {
            console.error("❌ Ошибка: Не все поля заполнены!");
            toast.error("Заполните все обязательные поля и добавьте изображение!");
            return;
        }

        setLoading(true);

        try {
            console.log("🔥 Отправка данных в Firestore...");
            const docRef = await addDoc(collection(db, "Promotions"), {
                title,
                secondTitle,
                category,
                description,
                startDate: formattedStartDate || null, // Если даты нет, записываем null
                endDate: formattedEndDate || null, // Если даты нет, записываем null
                imageBase64,
                createdAt: serverTimestamp(),
            });

            console.log("✅ Акция успешно добавлена! ID:", docRef.id);
            toast.success(`✅ Акция добавлена! ID: ${docRef.id}`);

            setTitle("");
            setSecondTitle("");
            setCategory("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setImageBase64(null);
        } catch (error) {
            console.error("❌ Ошибка при добавлении акции:", error);
            toast.error(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="bg-[#141414] min-h-screen flex justify-center items-center px-6">
            <div className="max-w-2xl w-full bg-[#1F1F1F] text-white shadow-xl p-8 rounded-lg border border-gray-800">
                <h2 className="text-3xl font-bold text-[#D7263D] text-center mb-6">Добавить акцию</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block font-semibold text-gray-400">Название акции</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D]"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-400">Второе название акции</label>
                        <input
                            type="text"
                            value={secondTitle}
                            onChange={(e) => setSecondTitle(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D]"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-400">Категория акции</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-gray-400">Дата начала</label>
                            <input
                                type="text"
                                placeholder="1 марта 2024"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D]"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-400">Дата окончания</label>
                            <input
                                type="text"
                                placeholder="6 марта 2024"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-400">Описание</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#D7263D] h-24 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-400">Изображение акции</label>
                        <label className="flex items-center justify-center w-full p-4 border border-gray-600 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700">
                            <Upload className="text-gray-400" size={24} />
                            <span className="ml-2 text-gray-300">Загрузить изображение</span>
                            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </label>
                    </div>
                    {imageBase64 && (
                        <div className="mb-4">
                            <img src={imageBase64} alt="Preview" className="rounded-md shadow-md w-full h-48 object-cover" />
                        </div>
                    )}
                    <motion.button
                        onClick={handleSubmit}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        className={`w-full py-3 rounded-md font-semibold transition ${
                            loading ? "bg-gray-600" : "bg-[#D7263D] hover:bg-red-700 text-white"
                        }`}
                    >
                        {loading ? "Добавление..." : "Добавить акцию"}
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default AddPromotion;
