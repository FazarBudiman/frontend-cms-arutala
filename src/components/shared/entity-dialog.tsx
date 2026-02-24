"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/shared/lib/cn";

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isPending?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
  contentClassName?: string;
}

/**
 * A generic dialog component for create/edit actions.
 * Wraps common AlertDialog structure with a form.
 */
export function EntityDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  onSubmit,
  isPending = false,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  className,
  contentClassName,
}: EntityDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={cn("sm:max-w-3xl max-h-max h-fit", className)}>
        <AlertDialogHeader className="shrink-0">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4", contentClassName)}>{children}</div>

          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                {cancelLabel}
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Saving..." : saveLabel}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
