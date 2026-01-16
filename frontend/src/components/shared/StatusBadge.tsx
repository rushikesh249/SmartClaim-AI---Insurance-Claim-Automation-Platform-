import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: string
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
    active: "success",
    pending: "warning",
    rejected: "destructive",
    approved: "success",
    draft: "secondary",
    completed: "default",
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
    const finalVariant = variant || statusMap[status.toLowerCase()] || "default"

    return (
        <Badge variant={finalVariant} className="capitalize">
            {status}
        </Badge>
    )
}
