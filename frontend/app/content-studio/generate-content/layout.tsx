export default function GenerateContentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    )
} 