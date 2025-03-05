import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu } from "lucide-react";

const categories = [
    {
        name: "наша коллекция",
        subcategories: [
            { name: "все товары категории"},
            { name: "макияж" },
            { name: "уход" },
            { name: "волосы" },
            { name: "парфюмерия" },
            { name: "для детей" },
            { name: "для дома" }
        ],
    },

    {
        name: "макияж",
        subcategories: [
            { name: "все товары категории" },
            { name: "новинки" },
            {
                name: "лицо",
                subcategories: [
                    { name: "все тоавры категории" },
                    { name: "BBC и CC кремы" },
                    { name: "Корректоры и консилеры" },
                    {name:"пудра"},
                    {name:"румяна"},
                    {name:"хайлайтеры"}
                ]
            },
            { name: "глаза" ,
                subcategories: [
                    { name: "все тоавры категории" },
                    { name: "глиттер" },
                    { name: "карандаш для глаз" },
                    {name:"накладные ресницы"},
                    {name:"тени для всех"},
                    {name:"тушь для ресниц"},
                    {name:"уход для ресниц"},
                ]},
            { name: "губы",
                subcategories: [
                    { name: "все тоавры категории" },
                    { name: "база для губ" },
                    { name: "губная помада" },
                    {name:"блекс для губ"},
                    {name:"карандаш для губ"},
                    {name:"тинты и пламемперы"},
                    {name:"уход для губ"},
                ] },
            { name: "брови" ,
                subcategories: [
                    { name: "все тоавры категории" },
                    { name: "база для макияжа" },
                    { name: "подводка" },
                    {name:"глиттер"},
                    {name:"карандаш для глаз"},
                    {name:"накладные ресницы"},
                    {name:"тени для век"},
                    {name:"тушь для ресниц"},
                    {name:"уход для ресниц"},
                ]},
            { name: "ногти",
                subcategories: [
                    { name: "все тоавры категории" },
                    { name: "лак для ногтей" },
                    { name: "база и топ" },
                    {name:"гель лаки"},
                    {name:"снятие лака и ремуверы"},
                    {name:"уход для ногтей"},
                    {name:"инструменты для маникюра и педикюра"},
                    {name:"накладные ногти"},
                    {name:"наращивание и моделирование"},
                    {name:"дизайн ногтей"},
                ] },
            { name: "кисти и спонжы" },
            { name: "палетки" },
            { name: "детям" },
            { name: "аксессуары" },
            { name: "наборы" },
            { name: "временные тату" },
        ],
    },
    {
        name: "волосы",
        subcategories: [
            { name: "все товары категории"},
            { name: "новинки" },
            { name: "шампуни" },
            { name: "бальзамы и кондиционеры" },
            { name: "сухие шампуни" },
            { name: "уход для волос" ,
                subcategories: [
                    {name:"все тоавры категории"},
                    {name:"маски"},
                    {name:"скрабы"},
                    {name:"масло"},
                    {name:"спциальный уход"},
                ]},
            { name: "проффесиональый уход" }
        ],
    },
    {
        name: "парфюмерия",
        subcategories: [
            {name:"все товары категории"},
            {name:"новинки"},
            {name:"женские ароматы"},
            {name:"мужские ароматы "},
            {name:"унисекс ароматы"},
            {name:"для детей"},
            {name:"ароматы для дома"},
            {name:"нишевая парфюмерия",
                subcategories:[
                    {name:"все тоавры категории"},
                    {name:"женская парфюмерия"},
                    {name:"мужская парфюмерия"},
                    {name:"унисекс ароматы"},
                ]},
        ]
    }
];

const CatalogDropdown = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [openedSubcategory, setOpenedSubcategory] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    let menuTimeout;

    const handleMouseEnter = () => {
        clearTimeout(menuTimeout);
        setShowMenu(true);
    };

    const handleMouseLeave = () => {
        menuTimeout = setTimeout(() => {
            setShowMenu(false);
            setHoveredCategory(null);
            setOpenedSubcategory(null);
        }, 200);
    };

    return (
        <>
            <button
                className="md:hidden text-[#E2E2D2] hover:text-[#C51F5D] transition duration-300"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu size={28} />
            </button>

            <div className="relative hidden md:block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="cursor-pointer text-[#E2E2D2] hover:text-[#C51F5D] transition duration-300 transform hover:scale-105">
                    каталог
                </div>

                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            className="absolute left-0 top-12 bg-[#243447] text-[#E2E2D2] w-[650px] shadow-xl rounded-xl p-5"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-2 gap-6">
                                {/* Левая колонка */}
                                <div className="space-y-3">
                                    {categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between cursor-pointer hover:text-[#C51F5D] transition px-3 py-2 rounded-lg hover:bg-[#141D26]"
                                            onMouseEnter={() => setHoveredCategory(category)}
                                        >
                                            <span className="font-semibold">{category.name}</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    ))}
                                </div>

                                {/* Правая колонка */}
                                <AnimatePresence>
                                    {hoveredCategory && (
                                        <motion.div
                                            className="space-y-2 border-l border-[#333] pl-4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {hoveredCategory.subcategories.map((subcategory, subIndex) => (
                                                <div key={subIndex} className="group">
                                                    <div
                                                        className="flex items-center justify-between cursor-pointer text-gray-300 px-3 py-2 rounded-lg group-hover:bg-[#333] transition"
                                                        onClick={() =>
                                                            setOpenedSubcategory(
                                                                openedSubcategory === subcategory ? null : subcategory
                                                            )
                                                        }
                                                    >
                                                        <span className="group-hover:text-white transition">
                                                            {subcategory.name}
                                                        </span>
                                                        {subcategory.subcategories && <ChevronRight size={16} />}
                                                    </div>

                                                    {/* Вложенные подкатегории */}
                                                    <AnimatePresence>
                                                        {openedSubcategory === subcategory && subcategory.subcategories && (
                                                            <motion.div
                                                                className="ml-4 mt-1 space-y-1 text-gray-400 pl-4 border-l border-[#444]"
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                {subcategory.subcategories.map((item, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="cursor-pointer hover:text-white transition px-3 py-1 rounded-lg hover:bg-[#444]"
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default CatalogDropdown;
