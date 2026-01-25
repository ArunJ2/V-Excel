interface DataCardProps {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function DataCard({ title, action, children, className = "" }: DataCardProps) {
    return (
        <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>}
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}
