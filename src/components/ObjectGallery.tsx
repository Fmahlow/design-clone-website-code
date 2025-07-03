import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ObjectGalleryProps {
  className?: string;
}

const ObjectGallery = ({ className }: ObjectGalleryProps) => {
  const images = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    url: `https://placehold.co/100x100?text=${i + 1}`,
    alt: `Objeto ${i + 1}`,
  }));

  return (
    <div
      className={cn(
        "w-80 bg-sidebar-bg border-l border-border p-6 flex flex-col h-full overflow-y-auto",
        className
      )}
    >
      <h2 className="text-sm font-medium text-foreground mb-4">
        Escolha o objeto
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {images.map((image) => (
          <button
            key={image.id}
            className="w-full h-20 bg-muted rounded-lg hover:opacity-80"
            aria-label={image.alt}
          />
        ))}
      </div>
      <Button className="mt-auto w-full">⚡ Substituir</Button>
    </div>
  );
};

export default ObjectGallery;

