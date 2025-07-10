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
        "w-[20%] mr-8 bg-sidebar-bg p-6 flex flex-col h-full overflow-y-auto rounded-2xl",
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
      <Button className="w-full" onClick={onReplace}>
        ⚡ Substituir
      </Button>
    </div>
  );
};

export default ObjectGallery;

