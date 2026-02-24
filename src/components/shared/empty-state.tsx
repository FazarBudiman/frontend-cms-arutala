"use client";

import { ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "icon";
}

/**
 * A higher-level component for displaying empty states consistently.
 */
export function EmptyState({ icon, title, description, children, className, variant = "icon" }: EmptyStateProps) {
  return (
    <Empty className={cn("border border-dashed", className)}>
      <EmptyHeader>
        {icon && <EmptyMedia variant={variant}>{icon}</EmptyMedia>}
        <EmptyTitle className="text-sm">{title}</EmptyTitle>
        {description && <EmptyDescription className="text-xs">{description}</EmptyDescription>}
      </EmptyHeader>
      {children}
    </Empty>
  );
}
