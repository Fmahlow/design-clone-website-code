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
    <div className="border-t border-border bg-card p-6 -mt-[100px]">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gerações anteriores</h3>
        
        <div className="relative">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {previousImages.map((image) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-24 h-18 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200"></div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousGenerations;