import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

interface ObjectGalleryProps {
  images: GalleryImage[];
  onReplace?: () => void;
  className?: string;
}

const ObjectGallery = ({ images, onReplace, className }: ObjectGalleryProps) => {

  return (
    <div
      className={cn(
        "w-[25%] mr-8 bg-sidebar-bg p-6 flex flex-col h-fit overflow-y-auto rounded-2xl",
        className
      )}
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2 space-x-2">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
            <span className="text-sm">2</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Mudar objeto</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="w-full h-20 bg-muted rounded-lg overflow-hidden flex items-center justify-center"
            aria-label={image.alt}
          >
            <img src={image.url} alt={image.alt} className="object-cover w-full h-full" />
          </div>
        ))}
      </div>
      <Button variant="gradient" className="w-full flex items-center justify-center" onClick={onReplace}>
        Substituir
        <span className="relative ml-2">
          <span className="text-lg">💎</span>
          <span className="absolute -top-1 -right-2 bg-background text-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">2</span>
        </span>
      </Button>
    </div>
  );
};

export default ObjectGallery;

