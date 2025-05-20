'use client';

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    ref? : React.Ref<HTMLUListElement> | React.Ref<HTMLDivElement>;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "선택하세요",
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

    // 클릭 외부 감지하여 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
                <span>{selectedLabel}</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 w-4 h-4" />
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-violet-400 rounded-md shadow-md max-h-60 overflow-auto">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                                value === option.value
                                    ? "bg-violet-50 text-violet-700 font-semibold"
                                    : "text-gray-800 hover:bg-violet-100"
                            }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}