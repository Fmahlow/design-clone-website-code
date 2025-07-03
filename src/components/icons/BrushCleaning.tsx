import React from "react";
import { LucideProps } from "lucide-react";

export const BrushCleaning = ({ ...props }: LucideProps) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 22h20" />
    <path d="M3 14v-3l9-9 4 4-9 9H3z" />
    <path d="M14 5l5 5" />
  </svg>
);

export default BrushCleaning;
