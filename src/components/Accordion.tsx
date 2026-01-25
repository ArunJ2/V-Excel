"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface AccordionProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
                <span className="flex items-center gap-2">{title}</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
