import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import StyleSidebar from "@/components/StyleSidebar";
import { useState } from "react";
import useGenerations from "@/hooks/useGenerations";

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const ChangeStyle = () => {
  const { addGeneration } = useGenerations();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
  };

  const handleGenerate = async (style: string) => {
    if (!image) return;
    setLoading(true);
    try {
      const blob = await fetch(image).then(r => r.blob());
      const form = new FormData();
      form.append('image', blob, 'image.png');
      form.append('style', style);
      const res = await fetch('/style', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Failed to generate');
      const outBlob = await res.blob();
      const dataUrl = await blobToDataURL(outBlob);
      setImage(dataUrl);
      addGeneration(dataUrl);
    } catch (err) {
      console.error('style generation failed', err);
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
            <span className="text-blue-500 font-medium">Mudar Estilo</span>
          </nav>
      </div>

      <div className="flex flex-1 items-start overflow-auto">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea onImageSelected={handleUpload} image={image} />
            <PreviousGenerations onSelect={(img) => setImage(img)} />
          </div>
        </div>

        <StyleSidebar
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
          onGenerate={handleGenerate}
          disableGenerate={loading}
        />
      </div>
    </div>
  );
};

export default ChangeStyle;
