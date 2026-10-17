import React, { useState, useEffect, useRef } from "react";
import { AdvancedImage } from "@cloudinary/react";
const lIF = [
    {
        "iF": "Baku Ane",
        "tI": 619
    },
    {
        "iF": "Chijoku no Seifuku",
        "tI": 2013
    },
    {
        "iF": "Chijoku no Seifuku 2",
        "tI": 2098
    },
    {
        "iF": "Gakuen 3",
        "tI": 2785
    },
    {
        "iF": "Ingoku no Houkago",
        "tI": 2203
    },
    {
        "iF": "Kutsujoku",
        "tI": 1980
    },
    {
        "iF": "Kutsujoku 2",
        "tI": 2074
    },
    {
        "iF": "Kutsujoku 3",
        "tI": 2184
    },
    {
        "iF": "Kyoiku Shido",
        "tI": 3005
    },
    {
        "iF": "Kyonyuu Daikazoku Saimin",
        "tI": 3563
    },
    {
        "iF": "Kyonyuu Elf Oyako Saimin",
        "tI": 2770
    },
    {
        "iF": "Kyonyuu Hitozuma Onna Kyoushi",
        "tI": 3123
    },
    {
        "iF": "Kyonyuu Kazoku Saimin",
        "tI": 3754
    },
    {
        "iF": "Kyonyuu Princess Saimin",
        "tI": 2413
    },
    {
        "iF": "Kyousei Shihai",
        "tI": 2288
    },
    {
        "iF": "Lovely\u00d7Cation",
        "tI": 1327
    },
    {
        "iF": "Lovely\u00d7Cation 2",
        "tI": 1355
    },
    {
        "iF": "Love\u00d7Holic",
        "tI": 635
    },
    {
        "iF": "Mama Daikou",
        "tI": 615
    },
    {
        "iF": "Mama\u00d7Holic",
        "tI": 571
    },
    {
        "iF": "Mesu Kyoushi 3",
        "tI": 1876
    },
    {
        "iF": "Mesu Kyoushi 4",
        "tI": 2284
    },
    {
        "iF": "Pure\u00d7Holic",
        "tI": 659
    },
    {
        "iF": "Sansha Mendan",
        "tI": 2863
    },
    {
        "iF": "Shihai no Kyoudan",
        "tI": 1864
    },
    {
        "iF": "Shihai no Kyoudan 2",
        "tI": 2275
    },
    {
        "iF": "Shimai no Kyousei",
        "tI": 2419
    },
    {
        "iF": "Shinshoku",
        "tI": 2358
    },
    {
        "iF": "Youkoso! Sukebe Elf no Mori e",
        "tI": 2373
    }
];
const Dialog = ({cld, onFolderChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(Number(localStorage.getItem("index")) || 0);
    const [selectedText, setSelectedText] = useState( "");

    const dialogRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "f" || event.key === "F") {
                setIsOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleOptionClick = (index, text) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOptionsVisible(false);
        onFolderChange(lIF[index])
        setIsOpen(false);
        setSelectedIndex(index);
        setSelectedText(text);
        localStorage.setItem("index", index);
    };

    return (
        <div>
            <div ref={dialogRef} className={`dialog-container ${isOpen ? "open" : ""}`}>
                <div id='exit'>
                    <i onClick={() => setIsOpen(false)} className='fa fa-times text-white'></i>
                </div>
                <div className='dialog-header'>Change folder</div>
                <div id='dialog-body' className='dialog-body'>
                    <div className={`select-menu ${optionsVisible ? "active" : ""}`}>
                        <div className='select-btn' onClick={() => setOptionsVisible(!optionsVisible)}>
                            <span className='sBtn-text'>{selectedText || "Select your option"}</span>
                            <i className='bx bx-chevron-down'></i>
                        </div>
                        {optionsVisible && (
                            <ul className='options'>
                                {lIF.map((option, index) => (
                                    <li
                                        key={index}
                                        className='option'
                                        onClick={() => handleOptionClick(index, option.iF)}
                                    >
                                        <div className='img-select-container'>
                                            <AdvancedImage
                                                cldImg={cld.image(`${option.iF}/1`)}
                                                className='img-select'
                                                alt={option.iF}
                                            />
                                        </div>
                                        <span className='option-text'>{option.iF}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
