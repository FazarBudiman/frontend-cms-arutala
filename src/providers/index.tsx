"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { BreadcrumbProvider } from "./breadcrumb-provider";

export { BreadcrumbProvider, useSetBreadcrumbLabel, useBreadcrumbLabels } from "./breadcrumb-provider";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <QueryProvider>
      <BreadcrumbProvider>{children}</BreadcrumbProvider>
    </QueryProvider>
  );
}
