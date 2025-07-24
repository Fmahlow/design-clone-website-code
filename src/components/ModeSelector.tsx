import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Type,
  Sparkles,
  Brush,
  LassoSelect,
} from "lucide-react";

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
      className={cn("inline-flex gap-1 p-1 border border-border rounded-md bg-muted/60", className)}
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="texto" className="w-8 h-8 p-0">
        <Type className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="inteligente" className="w-8 h-8 p-0">
        <Sparkles className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="pincel" className="w-8 h-8 p-0">
        <Brush className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="laco" className="w-8 h-8 p-0">
        <LassoSelect className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ModeSelector;
