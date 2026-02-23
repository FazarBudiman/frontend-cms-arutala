"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ContentBlockType, HeaderBlockData } from "../../type";

interface TableOfContentsProps {
  blocks: ContentBlockType[];
}

export function extractHeaders(blocks: ContentBlockType[]): { id: string; text: string; level: number }[] {
  return blocks
    .filter((block): block is { id: string; type: "header"; data: HeaderBlockData } => block.type === "header")
    .map((block) => ({
      id: block.id,
      text: block.data.text,
      level: block.data.level,
    }));
}

/**
 * TableOfContents - Sticky sidebar with scroll spy for navigation
 */
export function TableOfContents({ blocks }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // Extract h2 and h3 headers for TOC
  const headers = extractHeaders(blocks).filter((h) => h.level === 2 || h.level === 3);

  // Generate id from text
  const generateId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (headers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      },
    );

    // Observe all header elements
    headers.forEach((header) => {
      const id = generateId(header.text);
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headers]);

  if (headers.length === 0) return null;

  // Counter untuk penomoran sub-items
  let subItemCounter = 0;

  return (
    <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-orange-500 font-bold text-lg mb-4 pb-3 border-b border-orange-200">Table of Contents</h3>
      <nav>
        <ul className="space-y-0">
          {headers.map((header) => {
            const id = generateId(header.text);
            const isActive = activeId === id;
            const isSubItem = header.level === 3;

            // Reset counter untuk h2, increment untuk h3
            if (!isSubItem) {
              subItemCounter = 0;
            } else {
              subItemCounter++;
            }

            return (
              <li key={header.id} className="relative">
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`
                                        block transition-all duration-200 relative
                                        ${isSubItem ? "ml-4 pl-6 py-2 text-sm border-l-2 border-gray-200" : "pl-6 py-3 text-base font-medium"}
                                        ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}
                                    `}
                >
                  {/* Segitiga indikator untuk item aktif h2 - di kiri teks */}
                  {isActive && !isSubItem && <Image src="/src/article/segitiga-indikator.svg" width={20} height={20} alt="indicators" className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-auto" />}

                  {/* Segitiga indikator untuk item aktif h3 - di border gray
                                    {isActive && isSubItem && (
                                        <img
                                            src="/src/article/segitiga-indikator.svg"
                                            alt=""
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-auto"
                                        />
                                    )} */}

                  {/* Penomoran untuk sub-items */}
                  {isSubItem && <span className="mr-1 text-gray-600">{subItemCounter}.</span>}

                  {header.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
