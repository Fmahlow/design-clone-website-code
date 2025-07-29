import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGenerations from "@/hooks/useGenerations";

const Generations = () => {
  const { generations } = useGenerations();
  const [sortBy, setSortBy] = useState("newest");
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (open && carouselApi) {
      carouselApi.scrollTo(currentIndex);
    }
  }, [open, currentIndex, carouselApi]);

  const sortedGenerations = [...generations].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Breadcrumb */}
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-blue-500 font-medium">Minhas gerações</span>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Data de edição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Data de edição</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sortedGenerations.map((item, index) => (
              <div
                key={item.id}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index);
                  setOpen(true);
                }}
              >
                <img
                  src={item.image}
                  alt={`Generation ${item.id}`}
                  className="w-full h-full object-cover"
                />
                {item.mask && (
                  <img
                    src={item.mask}
                    alt="Mask"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                  />
                )}
              </div>
            ))}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl w-full p-0">
              <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="relative">
                <CarouselContent>
                  {sortedGenerations.map((item) => (
                    <CarouselItem key={item.id} className="flex items-center justify-center relative">
                      <img
                        src={item.image}
                        alt={`Generation ${item.id}`}
                        className="max-h-[80vh] w-full object-contain"
                      />
                      {item.mask && (
                        <img
                          src={item.mask}
                          alt="Mask"
                          className="absolute inset-0 max-h-[80vh] w-full object-contain opacity-50 pointer-events-none"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Generations;