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

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReplace = () => {
    if (!image) return;
    setGallery((prev) => [
      ...prev,
      {
        id: prev.length,
        url: image,
        alt: `Objeto ${prev.length + 1}`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-4 py-1">
          <nav className="flex items-center space-x-1 text-xs mb-0">
            <span className="text-muted-foreground">Home</span>
            <span className="mx-2 text-muted-foreground">{'>'}</span>
            <span className="text-blue-500 font-medium">Alterar objetos</span>
          </nav>
      </div>

      <div className="flex flex-1 overflow-hidden items-start">
        <div className="flex-1 flex flex-col overflow-y-auto px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea onImageSelected={handleUpload} />
            {image && (
              <div className="h-96 mt-4">
                <ObjectSelector image={image} />
              </div>
            )}
            <PreviousGenerations />
          </div>
        </div>

        <ObjectGallery
          images={gallery}
          onReplace={handleReplace}
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
        />
      </div>
    </div>
  );
};

export default ChangeObjects;

