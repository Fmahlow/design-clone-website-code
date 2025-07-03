import React from "react";
import { LucideProps } from "lucide-react";

export const Broom = ({ ...props }: LucideProps) => (
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
    <path d="M8 22 9 13l7-7 2 2-7 7" />
    <path d="M18 5l1-1" />
  </svg>
);

export default Broom;
