import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Undo2, Redo2, Brush, Eraser, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export interface BrushSelectorHandle {
  exportMask: () => string | null;
  resetSelections: () => void;
}

interface BrushSelectorProps {
  image: string | null;
}

const BrushSelector = forwardRef<BrushSelectorHandle, BrushSelectorProps>(({ image }, ref) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState<'brush' | 'erase'>('brush');
  const drawing = useRef(false);
  const last = useRef<{x: number, y: number} | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);

  useImperativeHandle(ref, () => ({
    exportMask: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL('image/png');
    },
    resetSelections: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      undoStack.current = [];
      redoStack.current = [];
    }
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const imgEl = imgRef.current;
    if (!canvas || !imgEl || !image) return;
    const handleResize = () => {
      canvas.width = imgEl.offsetWidth;
      canvas.height = imgEl.offsetHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  const getPos = (e: MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const pushState = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    undoStack.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    redoStack.current = [];
  };

  const draw = (e: MouseEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    if (tool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'white';
    }
    ctx.beginPath();
    if (last.current) {
      ctx.moveTo(last.current.x, last.current.y);
    } else {
      ctx.moveTo(pos.x, pos.y);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last.current = pos;
  };

  const handleDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    pushState();
    drawing.current = true;
    last.current = getPos(e);
    draw(e);
  };

  const handleUp = () => {
    drawing.current = false;
    last.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleDown as any);
    canvas.addEventListener('mousemove', draw as any);
    window.addEventListener('mouseup', handleUp);
    return () => {
      canvas.removeEventListener('mousedown', handleDown as any);
      canvas.removeEventListener('mousemove', draw as any);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [brushSize, tool]);

  const undo = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    if (undoStack.current.length === 0) return;
    redoStack.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    const img = undoStack.current.pop()!;
    ctx.putImageData(img,0,0);
  };

  const redo = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    if (redoStack.current.length === 0) return;
    undoStack.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    const img = redoStack.current.pop()!;
    ctx.putImageData(img,0,0);
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    undoStack.current = [];
    redoStack.current = [];
  };

  return (
    <div className="relative inline-block">
      {image && <img ref={imgRef} src={image} alt="imagem" className="block" />}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* toolbar */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-background/80 p-1 rounded">
        <Button size="icon" variant="ghost" onClick={undo}><Undo2 className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" onClick={redo}><Redo2 className="w-4 h-4" /></Button>
        <Button size="icon" variant={tool==='brush'? 'default':'ghost'} onClick={()=>setTool('brush')}><Brush className="w-4 h-4" /></Button>
        <Button size="icon" variant={tool==='erase'? 'default':'ghost'} onClick={()=>setTool('erase')}><Eraser className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" onClick={clear}><Trash2 className="w-4 h-4" /></Button>
        <div className="w-24 ml-2"><Slider value={[brushSize]} min={1} max={100} onValueChange={(v)=>setBrushSize(v[0])} /></div>
      </div>
    </div>
  );
});

export default BrushSelector;

