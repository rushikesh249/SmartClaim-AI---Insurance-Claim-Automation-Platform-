import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - hidden on mobile, usually would utilize sheet for mobile */}
            <aside className="hidden w-64 flex-col md:flex">
                <Sidebar className="h-full" />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
