import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectSelector, { ObjectSelectorHandle } from "@/components/ObjectSelector";
import DescriptionSidebar from "@/components/DescriptionSidebar";
import { useState, useRef } from "react";
import useGenerations from "@/hooks/useGenerations";

const ChangeObjects = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [maskPreview, setMaskPreview] = useState<string | null>(null);

  const selectorRef = useRef<ObjectSelectorHandle>(null);
  const { addGeneration } = useGenerations();

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setMaskPreview(null);
  };

  const handleGenerate = () => {
    const dataUrl = selectorRef.current?.exportMask();
    if (!dataUrl) return;
    setMaskPreview(dataUrl);
    addGeneration(dataUrl);
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

      <div className="flex flex-1 items-start overflow-auto">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea
              onImageSelected={handleUpload}
              renderPreview={(img) => (
                <div className="w-fit mx-auto relative">
                  <ObjectSelector ref={selectorRef} image={img} />
                  {maskPreview && (
                    <img
                      src={maskPreview}
                      alt="Máscara"
                      className="absolute inset-0 pointer-events-none"
                    />
                  )}
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>

        <DescriptionSidebar
          description={description}
          onDescriptionChange={setDescription}
          onGenerate={handleGenerate}
          className="mr-6 mt-2 self-start flex-none"
        />
      </div>
    </div>
  );
};

export default ChangeObjects;

