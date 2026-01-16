import { Button } from "@/components/ui/button"

import { Bell } from "lucide-react"

export function Topbar() {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-6 gap-4">
                <div className="flex-1">
                    {/* Breadcrumbs or Search could go here */}
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 border-l pl-4 ml-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary cursor-pointer">
                        JD
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
