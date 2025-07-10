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
        "w-[20%] mr-8 bg-sidebar-bg p-6 flex flex-col h-fit overflow-y-auto rounded-2xl",
        className
      )}
    >
      <h2 className="text-sm font-medium text-foreground mb-4">
        Escolha o objeto
      </h2>
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

