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
      className={className}
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="texto">Texto</ToggleGroupItem>
      <ToggleGroupItem value="inteligente">Seleção Inteligente</ToggleGroupItem>
      <ToggleGroupItem value="pincel">Pincel</ToggleGroupItem>
      <ToggleGroupItem value="laco">Laço</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ModeSelector;
