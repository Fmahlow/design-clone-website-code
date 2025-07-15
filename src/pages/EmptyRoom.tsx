// src/pages/EmptyRoom.tsx
import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";
import { useEffect, useRef, useState } from "react";
import { useDeepLab, SegmentationResult } from "@/lib/useDeepLab";

const COLORS = [
  [0,0,0], [128,0,0], [0,128,0], [128,128,0], [0,0,128], [128,0,128],
  [0,128,128], [128,128,128], [64,0,0], [192,0,0], [64,128,0], [192,128,0],
  [64,0,128], [192,0,128], [64,128,128], [192,128,128], [0,64,0], [128,64,0],
  [0,192,0], [128,192,0], [0,64,128]
];

const EmptyRoom = () => {
  const [image, setImage] = useState<string | null>(null);
  const [objects, setObjects] = useState<string[]>([]);
  const [segData, setSegData] = useState<SegmentationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready, segment, modelError } = useDeepLab();

  const handleUpload = async (dataUrl: string) => {
    setImage(dataUrl);
    setObjects([]);
    setSegData(null);
    setError(null);
    setLoading(true);

    try {
      // carrega a imagem
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("Falha ao carregar imagem"));
        img.src = dataUrl;
      });

      if (modelError) throw new Error(modelError);
      if (!ready)   console.warn("Modelo ainda não está pronto");

      const result = await segment(img);
      const labels = Array.from(new Set(Array.from(result.segmentationMap)));
      setObjects(labels.map(l => result.legend[l]).filter(Boolean));
      setSegData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const imgEl = imgRef.current;
    const canvas = canvasRef.current;
    if (!imgEl || !canvas || !segData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = imgEl.clientWidth;
    canvas.height = imgEl.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { segmentationMap, width, height } = segData;
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const offCtx = off.getContext("2d")!;
    const imgData = offCtx.createImageData(width, height);
    for (let i = 0; i < segmentationMap.length; i++) {
      const c = COLORS[segmentationMap[i] % COLORS.length];
      const j = i * 4;
      imgData.data[j] = c[0];
      imgData.data[j+1] = c[1];
      imgData.data[j+2] = c[2];
      imgData.data[j+3] = 120;
    }
    offCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  }, [segData, image]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{">"}</span>
          <span className="text-blue-500 font-medium">Esvaziar cômodo</span>
        </nav>
      </div>

      <div className="flex flex-1 items-start">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea
              onImageSelected={handleUpload}
              renderPreview={img => (
                <div className="w-full h-full relative">
                  <img
                    ref={imgRef}
                    src={img}
                    alt="Pré-visualização"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {(error || modelError) && (
                    <div className="absolute bottom-2 left-2 p-2 bg-red-100 text-red-800 rounded">
                      <strong>Erro:</strong> {error ?? modelError}
                    </div>
                  )}
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>
        <SettingsSidebar
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
          objects={objects}
          onRemoveObject={o => setObjects(prev => prev.filter(x => x !== o))}
          disableGenerate={loading}
        />
      </div>
    </div>
  );
};

export default EmptyRoom;
