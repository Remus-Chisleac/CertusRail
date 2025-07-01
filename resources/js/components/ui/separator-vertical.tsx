import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
    className?: string;
    height?: string;
    decorative?: boolean;
}

export function SeparatorVertical({
    className,
    height = "auto",
    decorative = true,
    ...props
}: SeparatorProps) {
    return (
        <div className={`h-` + height}>
            <SeparatorPrimitive.Root
                data-slot="separator-root"
                decorative={decorative}
                orientation="vertical"
                className={cn(
                    "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
                    className
                )}
                {...props}
            />
        </div>
    );
}
