import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectSelector, { ObjectSelectorHandle } from "@/components/ObjectSelector";
import DescriptionSidebar from "@/components/DescriptionSidebar";
import { useState, useRef } from "react";
import useGenerations from "@/hooks/useGenerations";

const ChangeObjects = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const selectorRef = useRef<ObjectSelectorHandle>(null);
  const { addGeneration } = useGenerations();

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setOriginalImage(dataUrl);
  };

  async function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  const handleGenerate = async () => {
    const maskData = selectorRef.current?.exportMask();
    if (!maskData || !image) return;
    setLoading(true);
    try {
      const imageBlob = await fetch(image).then(r => r.blob());
      const maskBlob = await fetch(maskData).then(r => r.blob());
      const form = new FormData();
      form.append('image', imageBlob, 'image.png');
      form.append('mask', maskBlob, 'mask.png');
      form.append('prompt', prompt);
      const res = await fetch('/inpaint', { method: 'POST', body: form });
      if (!res.ok) throw new Error('failed');
      const outBlob = await res.blob();
      const dataUrl = await blobToDataURL(outBlob);
      setImage(dataUrl);
      addGeneration(dataUrl);
      selectorRef.current?.resetSelections();
    } catch (err) {
      console.error('inpaint failed', err);
    } finally {
      setLoading(false);
    }
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
              image={image}
              renderPreview={(img) => (
                <div className="w-fit mx-auto relative flex flex-col items-center gap-4">
                  {originalImage && originalImage !== img && (
                    <img src={originalImage} alt="Original" className="max-w-full rounded-lg" />
                  )}
                  <ObjectSelector ref={selectorRef} image={img} />
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>

        <DescriptionSidebar
          description={prompt}
          onDescriptionChange={setPrompt}
          onGenerate={handleGenerate}
          disableGenerate={loading}
          className="mr-6 mt-2 self-start flex-none"
        />
      </div>
    </div>
  );
};

export default ChangeObjects;

