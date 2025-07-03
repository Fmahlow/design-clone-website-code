import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const PreviousGenerations = () => {
  // Mock data for previous generations
  const previousImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=150&fit=crop&crop=center`,
    alt: `Previous generation ${i + 1}`
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gerações anteriores</h3>

        <div className="relative">
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            onClick={scrollLeft}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div ref={scrollRef} className="flex overflow-x-auto space-x-3 px-8">
            {previousImages.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
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
