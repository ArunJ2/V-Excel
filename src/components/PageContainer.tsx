'use client';

import PageTransition from './PageTransition';

export default function PageContainer({ children, title, subtitle, action }: {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
                {children}
            </div>
        </PageTransition>
    );
}
