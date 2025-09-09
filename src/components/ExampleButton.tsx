"use client";

import React from "react";
import { Button } from "./ui/button";

interface ExampleButtonProps {
  text: string;
  promptText: string;
  onClick: (text: string) => void;
  className?: string;
}

export function ExampleButton({
  text,
  promptText,
  onClick,
  className,
}: ExampleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`relative overflow-hidden rounded-full border border-gray-300 dark:border-white/10 px-4 py-2 
    text-sm font-medium transition-all duration-300
    hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-white/10 dark:hover:to-white/5
    hover:border-gray-400 dark:hover:border-white/30 hover:shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]
    active:scale-95 
    ${className || ""}
  `}
      onClick={() => onClick(promptText)}
      type="button"
    >
      <span className="relative z-10">{text}</span>
    </Button>
  );
}
