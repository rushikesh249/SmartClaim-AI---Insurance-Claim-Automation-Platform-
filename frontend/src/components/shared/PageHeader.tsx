import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    children?: React.ReactNode
}

export function PageHeader({ title, description, children, className, ...props }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-6", className)} {...props}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex items-center space-x-2">{children}</div>}
        </div>
    )
}
