"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type BreadcrumbContextType = {
  labels: Record<string, string>;
  setLabel: (path: string, label: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const setLabel = useCallback((path: string, label: string) => {
    setLabels((prev) => {
      if (prev[path] === label) return prev;
      return { ...prev, [path]: label };
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ labels, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbLabels() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbLabels must be used within a BreadcrumbProvider");
  }
  return context;
}

/**
 * Hook to set a breadcrumb label for a specific path.
 * Should be used inside page components.
 */
export function useSetBreadcrumbLabel(path: string, label: string | undefined) {
  const { setLabel } = useBreadcrumbLabels();

  React.useEffect(() => {
    if (label) {
      setLabel(path, label);
    }
  }, [path, label, setLabel]);
}
