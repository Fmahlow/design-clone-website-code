import { useEffect, useRef, useState } from "react";

interface ObjectSelectorProps {
  image: string | null;
}


const ObjectSelector = ({ image }: ObjectSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker>();

  const isEncoded = useRef(false);
  const isDecoding = useRef(false);
  const lastPoints = useRef<{ point: [number, number]; label: number }[]>([]);
  const [modelReady, setModelReady] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../../worker_selecionar_objetos.js", import.meta.url), { type: "module" });
    workerRef.current = worker;

    const handleMessage = (e: MessageEvent) => {
      const { type, data } = e.data;
      if (type === "ready") {
        setModelReady(true);
      } else if (type === "segment_result") {
        if (data === "start") {
          setStatus("Segmentando objetos...");
        } else if (data === "done") {
          setStatus("Segmentação concluída");
          isEncoded.current = true;
        }
      } else if (type === "decode_result") {
        isDecoding.current = false;
        if (isEncoded.current) {
          drawMask(data.mask, data.scores);
        }
      }
    };
    worker.addEventListener("message", handleMessage);

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (image) {
      segment(image);
    }
  }, [image]);

  const segment = (data: string) => {
    if (!workerRef.current) return;
    isEncoded.current = false;
    setStatus("Segmentando objetos...");

    if (imgRef.current) {
      imgRef.current.src = data;
    }

    workerRef.current!.postMessage({ type: "segment", data: { image: data } });
  };

  const getPoint = (e: MouseEvent): { point: [number, number]; label: number } => {
    const img = imgRef.current;
    if (!img) return { point: [0, 0] as [number, number], label: 1 };
    const bb = img.getBoundingClientRect();
    const x = Math.max(0, Math.min((e.clientX - bb.left) / bb.width, 1));
    const y = Math.max(0, Math.min((e.clientY - bb.top) / bb.height, 1));
    return { point: [x, y] as [number, number], label: 1 };
  };

  const drawMask = (mask: any, scores: number[]) => {
    const canvas = maskCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const offCanvas = document.createElement("canvas");
    offCanvas.width = mask.width;
    offCanvas.height = mask.height;
    const offCtx = offCanvas.getContext("2d")!;
    const imageData = offCtx.createImageData(offCanvas.width, offCanvas.height);

    const numMasks = scores.length;
    let bestIndex = 0;
    for (let i = 1; i < numMasks; ++i) {
      if (scores[i] > scores[bestIndex]) bestIndex = i;
    }

    for (let i = 0; i < imageData.data.length; ++i) {
      if (mask.data[numMasks * i + bestIndex] === 1) {
        const offset = 4 * i;
        imageData.data[offset] = 0;
        imageData.data[offset + 1] = 114;
        imageData.data[offset + 2] = 189;
        imageData.data[offset + 3] = 255;
      }
    }

    offCtx.putImageData(imageData, 0, 0);

    const img = imgRef.current;
    if (!img) return;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      if (!isEncoded.current || isDecoding.current) return;
      const point = getPoint(e);
      lastPoints.current = [point];
      isDecoding.current = true;
      workerRef.current?.postMessage({ type: "decode", data: lastPoints.current });
    };
    const handleDown = (e: MouseEvent) => {
      if (!isEncoded.current) return;
      const point = getPoint(e);
      lastPoints.current = [{ point: point.point, label: e.button === 2 ? 0 : 1 }];
      isDecoding.current = true;
      workerRef.current?.postMessage({ type: "decode", data: lastPoints.current });
    };
    const preventContext = (e: MouseEvent) => e.preventDefault();

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mousedown", handleDown);
    container.addEventListener("contextmenu", preventContext);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mousedown", handleDown);
      container.removeEventListener("contextmenu", preventContext);
    };
  }, [modelReady]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {image && (
        <img
          ref={imgRef}
          src={image}
          alt="Imagem carregada"
          className="w-full h-full object-contain"
        />
      )}
      <canvas ref={maskCanvasRef} className="absolute inset-0 pointer-events-none" />
      {status && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-2 py-1 rounded text-xs">
          {status}
        </div>
      )}
    </div>
  );
};

export default ObjectSelector;

