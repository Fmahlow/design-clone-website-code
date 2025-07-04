import { useEffect, useRef, useState } from "react";

interface ObjectSelectorProps {
  image: string | null;
}

const SCALE_FACTOR = 4;
const PIXEL_THRESHOLD = 500000;

const ObjectSelector = ({ image }: ObjectSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker>();

  const isEncoded = useRef(false);
  const isDecoding = useRef(false);
  const lastPoints = useRef<{ point: [number, number]; label: number }[]>([]);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL("../../worker_selecionar_objetos.js", import.meta.url), { type: "module" });
    workerRef.current = worker;

    const handleMessage = (e: MessageEvent) => {
      const { type, data } = e.data;
      if (type === "ready") {
        setModelReady(true);
      } else if (type === "segment_result") {
        if (data === "done") {
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
    const img = new Image();
    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const shouldResize = originalWidth * originalHeight > PIXEL_THRESHOLD;
      const resizedWidth = shouldResize ? Math.floor(originalWidth / SCALE_FACTOR) : originalWidth;
      const resizedHeight = shouldResize ? Math.floor(originalHeight / SCALE_FACTOR) : originalHeight;

      const resizeCanvas = document.createElement("canvas");
      resizeCanvas.width = resizedWidth;
      resizeCanvas.height = resizedHeight;
      const rCtx = resizeCanvas.getContext("2d")!;
      rCtx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
      const resizedData = resizeCanvas.toDataURL();

      if (containerRef.current) {
        containerRef.current.style.backgroundImage = `url(${resizedData})`;
      }

      workerRef.current!.postMessage({ type: "segment", data: { image: resizedData } });
    };
    img.src = data;
  };

  const getPoint = (e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { point: [0, 0], label: 1 };
    const bb = container.getBoundingClientRect();
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

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
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
      lastPoints.current = [getPoint(e)];
      isDecoding.current = true;
      workerRef.current?.postMessage({ type: "decode", data: lastPoints.current });
    };
    container.addEventListener("mousemove", handleMove);
    return () => container.removeEventListener("mousemove", handleMove);
  }, [modelReady]);

  return (
    <div className="w-full h-full relative border" ref={containerRef}>
      <canvas ref={maskCanvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default ObjectSelector;

