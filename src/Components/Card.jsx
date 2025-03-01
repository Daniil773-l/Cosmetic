import Card1 from "../asets/img/Card1.webp"
import Card2 from "../asets/img/Card2.webp"
import Card3 from "../asets/img/Card3.webp"
import Card4 from "../asets/img/Card4.webp"
import { ArrowRight } from "lucide-react";

const categories = [
    { title: "Парфюм", image: Card1, link: "#" },
    { title: "Волосы", image: Card2, link: "#" },
    { title: "Макияж", image: Card3, link: "#" },
    { title: "Уход", image: Card4, link: "#" }
];

const CategoryGrid = () => {
    return (
        <section className="container mx-auto py-16 bg-[ABACAD] ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
                {categories.map((category, index) => (
                    <a key={index} href={category.link} className="group block relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform bg-[#F5F3F5]">
                        <img src={category.image} alt={category.title} className="w-full h-80 object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end p-6 transition-all group-hover:bg-black/50">
                            <h3 className="text-white text-2xl font-semibold mb-2">{category.title}</h3>
                            <span className="text-[#D7263D] text-2xl group-hover:translate-y-2 transition-transform"><ArrowRight/></span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
