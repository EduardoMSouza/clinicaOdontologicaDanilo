import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
        <body className="flex h-screen bg-gray-100 text-gray-900">
        {/* Sidebar fixa à esquerda */}
        <AppSidebar />

        {/* Área principal */}
        <div className="flex flex-col flex-1">
            <AppTopbar />

            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
        </body>
        </html>
    );
}
