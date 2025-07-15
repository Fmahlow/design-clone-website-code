// src/pages/EmptyRoom.tsx
import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";
import { useEffect, useRef, useState } from "react";
import { useYolo } from "@/lib/useYolo";

const ALLOWED_CLASSES = ["person","car","truck","bus","bench","potted plant"];
const MIN_SCORE = 0.5;
const MIN_AREA  = 1000;  // em pixels²

const EmptyRoom = () => {
  const [image, setImage] = useState<string | null>(null);
  const [objects, setObjects] = useState<string[]>([]);
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready, detect, modelError } = useYolo();

  const handleUpload = async (dataUrl: string) => {
    setImage(dataUrl);
    setObjects([]);
    setPreds([]);
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

      // rodar detecção
      const raw = await detect(img);

      // aplicar filtros:
      // Na parte de filtragem, altere para:
      const filtered = raw
      .filter(r => r.score >= 0.3)           
      // .filter(r => ALLOWED_CLASSES.includes(r.class))  // comente pra testar
      .filter(r => {
        const [, , w, h] = r.bbox;
        return w * h >= 100;                   // área mínima em 100 px²
      });


      console.log("📋 Labels filtrados:", filtered.map(r => r.class));
      setPreds(filtered);
      setObjects(Array.from(new Set(filtered.map(r => r.class))));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const imgEl = imgRef.current;
    const canvas = canvasRef.current;
    if (!imgEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = imgEl.clientWidth;
    canvas.height = imgEl.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    preds.forEach(p => {
      const [x,y,w,h] = p.bbox as number[];
      const sx = canvas.width  / imgEl.naturalWidth;
      const sy = canvas.height / imgEl.naturalHeight;

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth   = 2;
      ctx.strokeRect( x*sx, y*sy, w*sx, h*sy );

      const label = `${p.class} ${(p.score*100).toFixed(0)}%`;
      ctx.fillStyle = "rgba(59,130,246,0.8)";
      ctx.font       = "12px sans-serif";
      const tw = ctx.measureText(label).width + 4;
      const th = 14;
      ctx.fillRect( x*sx, y*sy - th, tw, th );
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x*sx + 2, y*sy - 2);
    });
  }, [preds, image]);

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
