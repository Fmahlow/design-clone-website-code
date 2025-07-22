import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ModeSelectorProps {
  mode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const ModeSelector = ({ mode, onModeChange, className }: ModeSelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(v) => v && onModeChange(v)}
      className={`bg-background/80 p-1 rounded-full shadow gap-1 ${className || ''}`}
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem className="rounded-full px-4" value="texto">Texto</ToggleGroupItem>
      <ToggleGroupItem className="rounded-full px-4" value="inteligente">Seleção Inteligente</ToggleGroupItem>
      <ToggleGroupItem className="rounded-full px-4" value="pincel">Pincel</ToggleGroupItem>
      <ToggleGroupItem className="rounded-full px-4" value="laco">Laço</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ModeSelector;
