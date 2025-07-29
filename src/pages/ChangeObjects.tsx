import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectSelector, { ObjectSelectorHandle } from "@/components/ObjectSelector";
import BrushSelector, { BrushSelectorHandle } from "@/components/BrushSelector";
import LassoSelector, { LassoSelectorHandle } from "@/components/LassoSelector";
import ModeSelector from "@/components/ModeSelector";
import DescriptionSidebar from "@/components/DescriptionSidebar";
import ReferenceSidebar from "@/components/ReferenceSidebar";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Download, Maximize2, Minimize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import translateToEnglish from "@/lib/translate";
import useGenerations from "@/hooks/useGenerations";

const ChangeObjects = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("texto");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [descCollapsed, setDescCollapsed] = useState(false);
  const [refCollapsed, setRefCollapsed] = useState(true);
  const [refImage, setRefImage] = useState<File | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  const selectorRef = useRef<ObjectSelectorHandle>(null);
  const brushRef = useRef<BrushSelectorHandle>(null);
  const lassoRef = useRef<LassoSelectorHandle>(null);
  const { addGeneration } = useGenerations();

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';
    link.click();
  };

  const handleSaveAs = async () => {
    if (!image) return;
    try {
      const blob = await fetch(image).then(r => r.blob());
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: 'image.png',
        types: [
          { description: 'PNG Image', accept: { 'image/png': ['.png'] } },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch {
      handleDownload();
    }
  };

  const toggleFullScreen = () => {
    const el = previewRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else if (document.fullscreenElement === el) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === previewRef.current);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
    setOriginalImage(dataUrl);
  };

  const toggleDesc = () => setDescCollapsed(v => !v);
  const toggleRef = () => {
    setRefCollapsed(v => {
      const newVal = !v;
      if (!newVal) setDescCollapsed(true);
      return newVal;
    });
  };

  async function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const imageBlob = await fetch(image).then(r => r.blob());
      const translated = await translateToEnglish(prompt);
      const form = new FormData();
      form.append('image', imageBlob, 'image.png');
      form.append('prompt', translated);

      if (mode === 'texto') {
        const res = await fetch('/flux-edit', { method: 'POST', body: form });
        if (!res.ok) throw new Error('failed');
        const outBlob = await res.blob();
        const dataUrl = await blobToDataURL(outBlob);
        setImage(dataUrl);
        addGeneration(dataUrl);
      } else {
        let maskData: string | null = null;
        if (mode === 'inteligente') maskData = selectorRef.current?.exportMask() ?? null;
        else if (mode === 'pincel') maskData = brushRef.current?.exportMask() ?? null;
        else if (mode === 'laco') maskData = lassoRef.current?.exportMask() ?? null;
        if (!maskData) return;
        const maskBlob = await fetch(maskData).then(r => r.blob());
        form.append('mask', maskBlob, 'mask.png');
        const res = await fetch('/inpaint', { method: 'POST', body: form });
        if (!res.ok) throw new Error('failed');
        const outBlob = await res.blob();
        const dataUrl = await blobToDataURL(outBlob);
        setImage(dataUrl);
        addGeneration(dataUrl);
        selectorRef.current?.resetSelections();
        brushRef.current?.resetSelections();
        lassoRef.current?.resetSelections();
      }
    } catch (err) {
      console.error('generation failed', err);
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
              headerRight={<ModeSelector mode={mode} onModeChange={setMode} />}
              onImageSelected={handleUpload}
              onRemoveImage={() =>
                originalImage && setImage(originalImage)
              }
              image={image}
              loading={loading}
              renderPreview={(img) => (
                <div className="w-fit mx-auto flex flex-col items-start">
                  <ModeSelector mode={mode} onModeChange={setMode} className="mb-2" />
                  <div className="flex items-center" ref={previewRef}>
                    <div className="relative">
                      {mode === 'inteligente' && (
                        <ObjectSelector ref={selectorRef} image={img} />
                      )}
                      {mode === 'pincel' && (
                        <BrushSelector ref={brushRef} image={img} />
                      )}
                      {mode === 'laco' && (
                        <LassoSelector ref={lassoRef} image={img} />
                      )}
                      {mode === 'texto' && (
                        <img src={img} alt="pré" className="block" />
                      )}
                    </div>
                    <TooltipProvider>
                      <div className="flex flex-col space-y-2 ml-2 self-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" className="h-8 w-8 p-0" variant="secondary" onClick={handleSaveAs}>
                              <Save className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Salvar como</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" className="h-8 w-8 p-0" variant="secondary" onClick={handleDownload}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" className="h-8 w-8 p-0" variant="secondary" onClick={toggleFullScreen}>
                              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Tela cheia</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                    {isFullscreen && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={toggleFullScreen}
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            />
            <PreviousGenerations onSelect={(img) => { setImage(img); setOriginalImage(img); }} />
          </div>
        </div>

        <div className="mr-2 mt-2 self-start flex-none flex flex-col space-y-4">
          <DescriptionSidebar
            description={prompt}
            onDescriptionChange={setPrompt}
            onGenerate={handleGenerate}
            disableGenerate={loading}
            collapsed={descCollapsed}
            onToggleCollapse={toggleDesc}
            className="w-[480px] mr-4"
          />
          <ReferenceSidebar
            onGenerate={handleGenerate}
            disableGenerate={loading}
            collapsed={refCollapsed}
            onToggleCollapse={toggleRef}
            onImageSelected={setRefImage}
            className="w-[480px] mr-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangeObjects;

