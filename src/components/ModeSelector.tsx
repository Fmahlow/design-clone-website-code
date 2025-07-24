import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
      className={cn(
        "inline-flex gap-1 p-1 border border-border rounded-md bg-gray-100",
        className
      )}
      variant="default"
      size="sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="texto"
            className="w-8 h-8 p-0 hover:bg-muted/50 data-[state=on]:bg-accent/70"
          >
            <Type className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Texto</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="inteligente"
            className="w-8 h-8 p-0 hover:bg-muted/50 data-[state=on]:bg-accent/70"
          >
            <Sparkles className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Seleção inteligente</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="pincel"
            className="w-8 h-8 p-0 hover:bg-muted/50 data-[state=on]:bg-accent/70"
          >
            <Brush className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Pincel</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="laco"
            className="w-8 h-8 p-0 hover:bg-muted/50 data-[state=on]:bg-accent/70"
          >
            <LassoSelect className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Laço</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
};

export default ModeSelector;
