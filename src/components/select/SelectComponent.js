import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing both up and down arrow icons

const SelectComponent = ({ options, selectedValue, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setFocusedIndex(-1); // Reset focus when opening/closing
    };

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            setIsOpen(true); // Open dropdown on arrow down
            setFocusedIndex((prevIndex) => (prevIndex + 1) % options.length);
        } else if (event.key === "ArrowUp") {
            setIsOpen(true); // Open dropdown on arrow up
            setFocusedIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
        } else if (event.key === "Enter" && focusedIndex >= 0) {
            handleSelect(options[focusedIndex]);
        } else if (event.key === "Escape") {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    const handleBlur = (event) => {
        if (!selectRef.current.contains(event.relatedTarget)) {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    useEffect(() => {
        if (focusedIndex >= 0 && isOpen) {
            selectRef.current.querySelectorAll("li")[focusedIndex]?.focus();
        }
    }, [focusedIndex, isOpen]);

    return (
        <div
            className={`relative inline-block w-full rounded-md ${isOpen ? "ring-2 ring-indigo-600" : ""}`}
            ref={selectRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <div
                className={`flex items-center justify-between block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 cursor-pointer ${
                    isOpen ? "bg-indigo-600" : ""
                }`}
                onClick={handleToggle}
            >
                <span>
                    {selectedValue ? selectedValue : <span className="text-gray-400">{placeholder}</span>}
                </span>
                {isOpen ? (
                    <FaChevronUp className="text-gray-400 ml-2" /> // Up arrow when open
                ) : (
                    <FaChevronDown className="text-gray-400 ml-2" /> // Down arrow when closed
                )}
            </div>
            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(option)}
                            className={`text-white py-2 px-4 cursor-pointer hover:bg-indigo-500 ${
                                focusedIndex === index ? "bg-indigo-600" : ""
                            }`}
                            tabIndex={-1}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectComponent;
