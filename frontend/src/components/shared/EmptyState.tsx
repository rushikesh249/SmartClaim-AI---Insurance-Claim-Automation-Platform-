import { type LucideIcon, FileX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    title: string
    description: string
    icon?: LucideIcon
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({ title, description, icon: Icon = FileX, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed bg-muted/50 h-[400px]">
            <div className="bg-background p-3 rounded-full mb-4 ring-1 ring-border">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">{description}</p>
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}
