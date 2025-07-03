import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PreviousGenerations = () => {
  // Mock data for previous generations
  const previousImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=150&fit=crop&crop=center`,
    alt: `Previous generation ${i + 1}`
  }));

  return (
    <div className="p-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gerações anteriores</h3>

        <div className="grid grid-cols-4 gap-3">
          {previousImages.map((image) => (
            <div
              key={image.id}
              className="w-full h-20 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousGenerations;