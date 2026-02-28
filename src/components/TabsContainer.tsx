"use client";

import { useState } from "react";

interface TabsContainerProps {
    overviewContent: React.ReactNode;
    historyContent: React.ReactNode;
    developmentContent: React.ReactNode;
    clinicalContent: React.ReactNode;
    reportsContent: React.ReactNode;
    userRole: string;
}

export default function TabsContainer({
    overviewContent,
    historyContent,
    developmentContent,
    clinicalContent,
    reportsContent,
    userRole
}: TabsContainerProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "background", label: "History & Medical" },
        { id: "development", label: "Development" },
        { id: "clinical", label: "Clinical Observations" },
        { id: "reports", label: "Plans & Reports" },
    ].filter(tab => {
        if (userRole === 'parent' && tab.id === 'reports') return false;
        return true;
    });

    return (
        <div>
            <div className="border-b border-slate-200 mb-6 sticky top-0 bg-white z-30 pt-2 pb-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
                <nav className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar pb-1 px-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-2.5 sm:px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap rounded-t-lg ${activeTab === tab.id
                                ? "border-brand-500 text-brand-500 bg-brand-50"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="min-h-[400px] pt-1">
                {activeTab === "overview" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{overviewContent}</div>}
                {activeTab === "background" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{historyContent}</div>}
                {activeTab === "development" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{developmentContent}</div>}
                {activeTab === "clinical" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{clinicalContent}</div>}
                {activeTab === "reports" && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{reportsContent}</div>}
            </div>
        </div>
    );
}
