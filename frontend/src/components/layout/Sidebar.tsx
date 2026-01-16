import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, AlertCircle, Settings, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    {
        title: "Overview",
        href: "/app",
        icon: LayoutDashboard,
        end: true
    },
    {
        title: "Policies",
        href: "/app/policies",
        icon: Shield,
    },
    {
        title: "Claims",
        href: "/app/claims",
        icon: AlertCircle,
    },
    {
        title: "Settings",
        href: "/app/settings",
        icon: Settings,
    },
]

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation()

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-card", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-6">
                        <div className="h-6 w-6 bg-primary rounded-sm mr-2" />
                        <h2 className="text-lg font-bold tracking-tight">SmartClaim AI</h2>
                    </div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    ((item.end && location.pathname === item.href) || (!item.end && location.pathname.startsWith(item.href)))
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
