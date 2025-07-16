import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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
  const [selectedMasks, setSelectedMasks] = useState<any[]>([]);
  const [currentMask, setCurrentMask] = useState<{mask: any, scores: number[]} | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ObjectSelector] Criando worker");
    const worker = new Worker(new URL("../../worker_selecionar_objetos.js", import.meta.url), { type: "module" });
    workerRef.current = worker;

    const handleMessage = (e: MessageEvent) => {
      const { type, data } = e.data;
      if (type === "ready") {
        console.log("[ObjectSelector] Worker pronto");
        setModelReady(true);
      } else if (type === "segment_result") {
        if (data === "start") {
          console.log("[ObjectSelector] Iniciou segmentação");
          setStatus("Segmentando objetos...");
        } else if (data === "done") {
          console.log("[ObjectSelector] Segmentação concluída");
          setStatus("Segmentação concluída");
          isEncoded.current = true;
        }
      } else if (type === "decode_result") {
        console.log("[ObjectSelector] Resultado de decode recebido");
        isDecoding.current = false;
        if (isEncoded.current) {
          setCurrentMask({ mask: data.mask, scores: data.scores });
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
    console.log("[ObjectSelector] Enviando imagem para segmentação");
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

  const drawMask = (mask: any, scores: number[], addToSelection = false) => {
    console.log("[ObjectSelector] Desenhando máscara");
    const canvas = maskCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = imgRef.current;
    if (!img) return;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar todas as máscaras selecionadas
    selectedMasks.forEach((selectedMask, index) => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = selectedMask.mask.width;
      offCanvas.height = selectedMask.mask.height;
      const offCtx = offCanvas.getContext("2d")!;
      const imageData = offCtx.createImageData(offCanvas.width, offCanvas.height);

      // Cores diferentes para cada máscara
      const colors = [
        [0, 114, 189],    // azul
        [255, 165, 0],    // laranja
        [34, 139, 34],    // verde
        [220, 20, 60],    // vermelho
        [138, 43, 226],   // roxo
      ];
      const color = colors[index % colors.length];

      for (let i = 0; i < imageData.data.length; ++i) {
        if (selectedMask.mask.data[selectedMask.numMasks * i + selectedMask.bestIndex] === 1) {
          const offset = 4 * i;
          imageData.data[offset] = color[0];
          imageData.data[offset + 1] = color[1];
          imageData.data[offset + 2] = color[2];
          imageData.data[offset + 3] = 150; // semi-transparente
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
    });

    // Desenhar a máscara atual (temporária)
    if (!addToSelection) {
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
          imageData.data[offset] = 255;
          imageData.data[offset + 1] = 255;
          imageData.data[offset + 2] = 255;
          imageData.data[offset + 3] = 100; // mais transparente para preview
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
    }
  };

  const addMaskToSelection = (mask: any, scores: number[]) => {
    const numMasks = scores.length;
    let bestIndex = 0;
    for (let i = 1; i < numMasks; ++i) {
      if (scores[i] > scores[bestIndex]) bestIndex = i;
    }

    setSelectedMasks(prev => [...prev, { mask, scores, numMasks, bestIndex }]);
  };

  const resetSelections = () => {
    setSelectedMasks([]);
    setCurrentMask(null);
    // Redesenhar apenas com as máscaras selecionadas (que agora estão vazias)
    if (currentMask) {
      drawMask(currentMask.mask, currentMask.scores);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      if (!isEncoded.current || isDecoding.current) return;
      const point = getPoint(e);
      lastPoints.current = [point];
      isDecoding.current = true;
      console.log("[ObjectSelector] Decodificando ponto", point);
      workerRef.current?.postMessage({ type: "decode", data: lastPoints.current });
    };
    const handleDown = (e: MouseEvent) => {
      if (!isEncoded.current) return;
      e.preventDefault();
      
      // Adicionar a máscara atual à seleção permanente quando clicar
      if (currentMask) {
        addMaskToSelection(currentMask.mask, currentMask.scores);
        console.log("[ObjectSelector] Máscara adicionada à seleção");
      }
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
  }, [modelReady, currentMask]);

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
      
      {/* Reset button */}
      {selectedMasks.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 left-2 z-10"
          onClick={resetSelections}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Resetar
        </Button>
      )}
      
      {status && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-2 py-1 rounded text-xs">
          {status}
        </div>
      )}
      
      {selectedMasks.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
          {selectedMasks.length} objeto(s) selecionado(s)
        </div>
      )}
    </div>
  );
};

export default ObjectSelector;

