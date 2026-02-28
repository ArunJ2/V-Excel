'use client';

import PageTransition from './PageTransition';

export default function PageContainer({ children, title, subtitle, action }: {
    children: React.ReactNode;
    title: React.ReactNode;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <PageTransition>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        {subtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
                {children}
            </div>
        </PageTransition>
    );
}
