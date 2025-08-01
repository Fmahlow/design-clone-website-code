import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Undo2, Redo2, Brush, Eraser, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const previewRef = useRef<HTMLDivElement>(null);
  const [brushSize, setBrushSize] = useState(40);
  const [tool, setTool] = useState<'brush' | 'erase'>('brush');
  const drawing = useRef(false);
  const last = useRef<{x: number, y: number} | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);

  useImperativeHandle(ref, () => ({
    exportMask: () => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return null;
      const out = document.createElement('canvas');
      out.width = img.naturalWidth;
      out.height = img.naturalHeight;
      const ctx = out.getContext('2d')!;
        
      ctx.clearRect(0, 0, out.width, out.height);
      ctx.drawImage(canvas, 0, 0, out.width, out.height);
      // convert non-transparent pixels to white to ensure a binary mask
      const imgData = ctx.getImageData(0, 0, out.width, out.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] > 0) {
          imgData.data[i] = 255;
          imgData.data[i + 1] = 255;
          imgData.data[i + 2] = 255;
          imgData.data[i + 3] = 255;
        } else {
          imgData.data[i] = 0;
          imgData.data[i + 1] = 0;
          imgData.data[i + 2] = 0;
          imgData.data[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return out.toDataURL('image/png');
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

  const updatePreview = (e: MouseEvent) => {
    const pos = getPos(e);
    const preview = previewRef.current;
    if (!preview) return;
    preview.style.display = 'block';
    preview.style.width = `${brushSize}px`;
    preview.style.height = `${brushSize}px`;
    preview.style.left = `${pos.x}px`;
    preview.style.top = `${pos.y}px`;
    preview.style.transform = 'translate(-50%, -50%)';
    const ring = getComputedStyle(document.documentElement)
      .getPropertyValue('--sidebar-ring')
      .trim();
    preview.style.background =
      tool === 'erase'
        ? 'rgba(0,0,0,0.2)'
        : `hsla(${ring} / 0.2)`;
    preview.style.border =
      tool === 'erase'
        ? '1px solid red'
        : `1px solid hsla(${ring} / 0.8)`;
    preview.style.color =
      tool === 'erase' ? 'red' : `hsl(${ring})`;
  };

  const hidePreview = () => {
    const preview = previewRef.current;
    if (preview) preview.style.display = 'none';
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
      const ring = getComputedStyle(document.documentElement)
        .getPropertyValue('--sidebar-ring')
        .trim();
      ctx.strokeStyle = `hsl(${ring})`;
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
    canvas.addEventListener('mousemove', updatePreview as any);
    canvas.addEventListener('mouseenter', updatePreview as any);
    canvas.addEventListener('mouseleave', hidePreview);
    window.addEventListener('mouseup', handleUp);
    return () => {
      canvas.removeEventListener('mousedown', handleDown as any);
      canvas.removeEventListener('mousemove', draw as any);
      canvas.removeEventListener('mousemove', updatePreview as any);
      canvas.removeEventListener('mouseenter', updatePreview as any);
      canvas.removeEventListener('mouseleave', hidePreview);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [brushSize, tool]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    pushState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <TooltipProvider>
      <div className="inline-block">
        <div className="relative inline-block">
        {image && <img ref={imgRef} src={image} alt="imagem" className="block" />}
        <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />
        <div
          ref={previewRef}
          className="absolute pointer-events-none rounded-full hidden flex items-center justify-center select-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-xs leading-none text-[hsl(var(--sidebar-ring))]">+</span>
        </div>
        </div>
        {/* toolbar below image */}
        <div className="mt-2 flex items-center space-x-2 bg-background/80 p-1 rounded">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={undo}><Undo2 className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={redo}><Redo2 className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant={tool==='brush'? 'default':'ghost'} onClick={()=>setTool('brush')}><Brush className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Pincel</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant={tool==='erase'? 'default':'ghost'} onClick={()=>setTool('erase')}><Eraser className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Borracha</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={clear}><Trash2 className="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Apagar tudo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-24 ml-2"><Slider value={[brushSize]} min={1} max={100} onValueChange={(v)=>setBrushSize(v[0])} /></div>
            </TooltipTrigger>
            <TooltipContent>Espessura do pincel</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default BrushSelector;

