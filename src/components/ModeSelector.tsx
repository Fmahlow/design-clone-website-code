import { useEffect, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ModeSelectorProps {
  mode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const ModeSelector = ({ mode, onModeChange, className }: ModeSelectorProps) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const group = groupRef.current;
    const indicator = indicatorRef.current;
    if (!group || !indicator) return;
    const active = group.querySelector('[data-state="on"]') as HTMLElement | null;
    if (!active) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [mode]);

  return (
    <div
      className={`relative inline-flex border border-border rounded-full ${className || ''}`}
    >
      <span
        ref={indicatorRef}
        className="absolute left-0 top-0 h-full rounded-full bg-muted transition-all duration-300"
      />
      <ToggleGroup
        ref={groupRef}
        type="single"
        value={mode}
        onValueChange={(v) => v && onModeChange(v)}
        className="relative p-1 gap-1"
        variant="default"
        size="sm"
      >
        <ToggleGroupItem className="rounded-full px-4 transition-colors" value="texto">Texto</ToggleGroupItem>
        <ToggleGroupItem className="rounded-full px-4 transition-colors" value="inteligente">Seleção Inteligente</ToggleGroupItem>
        <ToggleGroupItem className="rounded-full px-4 transition-colors" value="pincel">Pincel</ToggleGroupItem>
        <ToggleGroupItem className="rounded-full px-4 transition-colors" value="laco">Laço</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeSelector;
