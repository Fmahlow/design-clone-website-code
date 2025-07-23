import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import useGenerations from "@/hooks/useGenerations";

interface PreviousGenerationsProps {
  onSelect?: (img: string) => void;
}

const PreviousGenerations = ({ onSelect }: PreviousGenerationsProps) => {
  const { generations } = useGenerations();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="px-6 pb-4 pt-1">
      <div className="w-full mx-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Gerações anteriores</h3>

        <div className="relative">
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            onClick={scrollLeft}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div ref={scrollRef} className="flex overflow-x-auto space-x-3 px-8 py-4 border border-border rounded-lg">
            {generations.map(image => (
              <div
                key={image.id}
                className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onDoubleClick={() => onSelect?.(image.image)}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('text/plain', image.image);
                }}
              >
                <img src={image.image} alt="geração" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={scrollRight}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviousGenerations;
