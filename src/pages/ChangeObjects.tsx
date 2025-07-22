import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectSelector, { ObjectSelectorHandle } from "@/components/ObjectSelector";
import BrushSelector, { BrushSelectorHandle } from "@/components/BrushSelector";
import ModeSelector from "@/components/ModeSelector";
import DescriptionSidebar from "@/components/DescriptionSidebar";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, Download, Maximize2 } from "lucide-react";
import translateToEnglish from "@/lib/translate";
import useGenerations from "@/hooks/useGenerations";

const ChangeObjects = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("texto");

  const selectorRef = useRef<ObjectSelectorHandle>(null);
  const brushRef = useRef<BrushSelectorHandle>(null);
  const { addGeneration } = useGenerations();

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';
    link.click();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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
    let maskData: string | null = null;
    if (mode === 'inteligente') maskData = selectorRef.current?.exportMask() ?? null;
    else if (mode === 'pincel') maskData = brushRef.current?.exportMask() ?? null;
    if (!maskData || !image) return;
    setLoading(true);
    try {
      const imageBlob = await fetch(image).then(r => r.blob());
      const maskBlob = await fetch(maskData).then(r => r.blob());
      const form = new FormData();
      form.append('image', imageBlob, 'image.png');
      form.append('mask', maskBlob, 'mask.png');
      const translated = await translateToEnglish(prompt);
      form.append('prompt', translated);
      const res = await fetch('/inpaint', { method: 'POST', body: form });
      if (!res.ok) throw new Error('failed');
      const outBlob = await res.blob();
      const dataUrl = await blobToDataURL(outBlob);
      setImage(dataUrl);
      addGeneration(dataUrl);
      selectorRef.current?.resetSelections();
      brushRef.current?.resetSelections();
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
            <ModeSelector
              mode={mode}
              onModeChange={setMode}
              className="ml-4 mt-2 mb-1 w-fit"
            />
            <UploadArea
              onImageSelected={handleUpload}
              onRemoveImage={() =>
                originalImage && setImage(originalImage)
              }
              image={image}
              loading={loading}
              renderPreview={(img) => (
                <div className="w-fit mx-auto">
                  <div className="relative">
                    {mode === 'inteligente' && (
                      <ObjectSelector ref={selectorRef} image={img} />
                    )}
                    {mode === 'pincel' && (
                      <BrushSelector ref={brushRef} image={img} />
                    )}
                    {(mode === 'texto' || mode === 'laco') && (
                      <img src={img} alt="pré" className="block" />
                    )}
                  </div>
                </div>
              )}
            />
            <PreviousGenerations onSelect={(img) => { setImage(img); setOriginalImage(img); }} />
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
      {image && (
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
          <Button size="icon" variant="secondary" onClick={handleDownload}>
            <Save className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={toggleFullScreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangeObjects;

