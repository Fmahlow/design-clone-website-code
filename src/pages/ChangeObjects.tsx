import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectGallery from "@/components/ObjectGallery";
import ObjectSelector from "@/components/ObjectSelector";
import { useState } from "react";

const ChangeObjects = () => {
  const [image, setImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      url: `https://placehold.co/100x100?text=${i + 1}`,
      alt: `Objeto ${i + 1}`,
    }))
  );

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
  };

  const handleReplace = () => {
    // TODO: implement object replacement logic
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="px-4 py-1">
          <nav className="flex items-center space-x-1 text-xs mb-0">
            <span className="text-muted-foreground">Home</span>
            <span className="mx-2 text-muted-foreground">{'>'}</span>
            <span className="text-blue-500 font-medium">Alterar objetos</span>
          </nav>
      </div>

      <div className="flex flex-1 items-start gap-4 overflow-hidden px-4 pt-2 pb-8">
        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full">
            <UploadArea
              onImageSelected={handleUpload}
              renderPreview={(img) => (
                <div className="w-full h-[32rem] mx-auto">
                  <ObjectSelector image={img} />
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <ObjectGallery
            images={gallery}
            onReplace={handleReplace}
            className="border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangeObjects;

