import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { scroller } from "react-scroll";
import Header from "./Components/Header";
import Banner from "./Components/Banner";
import Card from "./Components/Card";
import Bestsellers from "./Components/Bestrsellers";
import Footer from "./Components/Footer";
import Kollage from "./asets/img/Kollag.webp";
import Kollage2 from "./asets/img/Kollag1.webp";
import Kollage3 from "./asets/img/Kollag2.webp";

// Анимации появления блоков
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function App() {
    // Управление анимацией при скролле
    const controls = useAnimation();

    useEffect(() => {
        const handleScroll = () => {
            controls.start("visible");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [controls]);

    const blocks = [
        {
            title: "ЕЖЕДНЕВНЫЙ УХОД ЗА КОЖЕЙ",
            description:
                "Тонизирующее масло для тела питает энергией, улучшает эластичность и гладкость кожи. В составе обязательно присутствуют масла мяты, розмарина и герани, которые повышают крепкость и упругость кожи.",
            image: Kollage,
            reverse: false,
        },
        {
            title: "РАСПАХНУТЫЙ ВЗГЛЯД",
            description:
                "Подарите вашим ресницам объём и выразительность одним движением. Тушь насыщена каяловыми пигментами, которые делают каждую ресничку экстремально-чёрной.",
            image: Kollage2,
            reverse: true,
        },
        {
            title: "ПОДБИРАЕМ ПРАВИЛЬНЫЙ ТОН",
            description:
                "Придайте коже сияющий вид с невесомым тональным кремом. Крем выравнивает текстуру кожи, скрывает поры и мелкие морщинки.",
            image: Kollage3,
            reverse: false,
        },
    ];

    return (
        <>
            {/* 🔹 HEADER с плавным скроллом к блокам */}
            <Header />
            <Banner />

            {/* 🔹 КАРТОЧКИ */}
            <motion.section
                className="container mx-auto py-16 px-6"
                initial="hidden"
                animate={controls}
                variants={fadeInUp}
            >
                <Card />
                <Bestsellers />
            </motion.section>

            {/* 🔹 БЛОКИ С ТЕКСТОМ */}
            <section className="container mx-auto py-16 px-6">
                {blocks.map((block, index) => (
                    <motion.div
                        key={index}
                        className={`flex flex-col md:flex-row ${
                            block.reverse ? "md:flex-row-reverse" : ""
                        } items-center gap-12 mb-16`}
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeInUp}
                        viewport={{ once: true }}
                    >
                        {/* 🔹 ТЕКСТОВЫЙ БЛОК */}
                        <div className="md:w-1/2 flex flex-col justify-center items-start px-6">
                            <h3 className="text-4xl font-extrabold text-[#D7263D] mb-4 max-w-[600px] leading-snug">
                                {block.title}
                            </h3>
                            <p className="text-lg text-[#141414] mb-6 max-w-[600px] leading-relaxed">
                                {block.description}
                            </p>
                            <button
                                className="bg-[#D7263D] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                                onClick={() => scroller.scrollTo("footer", { smooth: true, duration: 800 })}
                            >
                                Подробнее
                            </button>
                        </div>

                        {/* 🔹 ИЗОБРАЖЕНИЕ */}
                        <div className="md:w-1/2">
                            <motion.img
                                src={block.image}
                                alt={block.title}
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* 🔹 FOOTER с плавным скроллом */}
            <motion.div id="footer" initial="hidden" animate="visible" variants={fadeInUp}>
                <Footer />
            </motion.div>
        </>
    );
}

export default App;
