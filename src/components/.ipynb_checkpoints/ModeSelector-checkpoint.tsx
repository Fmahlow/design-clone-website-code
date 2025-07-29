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
  const items = [
    { value: 'texto', icon: Type, label: 'Texto' },
    { value: 'inteligente', icon: Sparkles, label: 'Seleção inteligente' },
    { value: 'pincel', icon: Brush, label: 'Pincel' },
    { value: 'laco', icon: LassoSelect, label: 'Laço' },
  ];

  return (
    <ToggleGroup
      type="single"
      value={mode}
      defaultValue="texto"
      onValueChange={(v) => v && onModeChange(v)}
      className={cn(
        'inline-flex gap-1 p-1 border border-border rounded-md bg-gray-50',
        className
      )}
      variant="default"
      size="sm"
    >
      {items.map(({ value, icon: Icon, label }) => {
        const isActive = mode === value;
        return (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={value}
                className={cn(
                  'w-8 h-8 p-0 flex items-center justify-center',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-600',
                  'hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
};

export default ModeSelector;
