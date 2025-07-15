import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";
import { useEffect, useRef, useState } from "react";
import { useYolo } from "@/lib/useYolo";

const EmptyRoom = () => {
  const [image, setImage] = useState<string | null>(null);
  const [objects, setObjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preds, setPreds] = useState<any[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { detect } = useYolo();

  const handleUpload = async (dataUrl: string) => {
    setImage(dataUrl);
    setObjects([]);
    setPreds([]);
    setLoading(true);
    try {
      const img = new Image();
      const loaded = new Promise((res) => {
        img.onload = () => res(null);
      });
      img.src = dataUrl;
      await loaded;
      const results = await detect(img);
      const names = Array.from(
        new Set(results.map((r: any) => r.class || r.label || r.name)),
      ) as string[];
      setObjects(names);
      setPreds(results);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (obj: string) => {
    setObjects(objects.filter((o) => o !== obj));
  };

  useEffect(() => {
    const imgEl = imgRef.current;
    const canvas = canvasRef.current;
    if (!imgEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      canvas.width = imgEl.clientWidth;
      canvas.height = imgEl.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      preds.forEach((p: any) => {
        if (!p) return;
        const box = p.bbox || p.box || p.xywh || p.xyxy;
        if (!box) return;
        let [x, y, w, h] = box;
        if (box.length === 4 && p.xyxy) {
          w = box[2] - box[0];
          h = box[3] - box[1];
          x = box[0];
          y = box[1];
        }
        const scaleX = canvas.width / imgEl.naturalWidth;
        const scaleY = canvas.height / imgEl.naturalHeight;
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);
        const label = p.class || p.label || p.name;
        if (label) {
          ctx.fillStyle = "rgba(59,130,246,0.8)";
          ctx.font = "12px sans-serif";
          const textWidth = ctx.measureText(label).width + 4;
          const textHeight = 14;
          ctx.fillRect(
            x * scaleX,
            y * scaleY - textHeight,
            textWidth,
            textHeight,
          );
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x * scaleX + 2, y * scaleY - 2);
        }
      });
    };
    draw();
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
              renderPreview={(img) => (
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
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>

        <SettingsSidebar
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
          objects={objects}
          onRemoveObject={handleRemove}
          disableGenerate={loading}
        />
      </div>
    </div>
  );
};

export default EmptyRoom;
