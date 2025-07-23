import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Trash, CircleSlash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface LassoSelectorHandle {
  exportMask: () => string | null;
  resetSelections: () => void;
}

interface LassoSelectorProps {
  image: string | null;
}

interface Point { x: number; y: number; }
interface Polygon { points: Point[]; }

const LassoSelector = forwardRef<LassoSelectorHandle, LassoSelectorProps>(({ image }, ref) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [selected, setSelected] = useState(0);
  const [invert, setInvert] = useState(false);
  const [hover, setHover] = useState<Point | null>(null);

  useImperativeHandle(ref, () => ({
    exportMask: () => {
      if (!imgRef.current) return null;
      const width = imgRef.current.naturalWidth;
      const height = imgRef.current.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = invert ? "white" : "black";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = invert ? "black" : "white";
      polygons.forEach(poly => {
        ctx.beginPath();
        poly.points.forEach((pt, i) => {
          const x = pt.x * width;
          const y = pt.y * height;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
      });
      return canvas.toDataURL("image/png");
    },
    resetSelections: () => {
      setPolygons([]);
      setCurrent([]);
      setSelected(0);
      setInvert(false);
    }
  }), [polygons, invert]);

  const getPoint = (e: MouseEvent): Point => {
    const img = imgRef.current!;
    const rect = img.getBoundingClientRect();
    const x = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const y = Math.max(0, Math.min((e.clientY - rect.top) / rect.height, 1));
    return { x, y };
  };

  const closePolygon = () => {
    if (current.length > 2) {
      setPolygons(prev => [...prev, { points: current }]);
      setSelected(polygons.length);
    }
    setCurrent([]);
  };

  const handleClick = (e: MouseEvent) => {
    if (!image) return;
    const p = getPoint(e);
    if (current.length > 0) {
      const first = current[0];
      const dx = p.x - first.x;
      const dy = p.y - first.y;
      if (Math.sqrt(dx * dx + dy * dy) < 0.02) {
        closePolygon();
        return;
      }
    }
    if (e.detail === 2) {
      closePolygon();
      return;
    }
    setCurrent(prev => [...prev, p]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const draw = () => {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ring = getComputedStyle(document.documentElement)
        .getPropertyValue("--sidebar-ring")
        .trim();
      const palette = [
        ring,
        "140 70% 45%",
        "60 90% 50%",
        "210 90% 55%",
        "300 70% 60%",
      ];

      ctx.lineWidth = 2;
      polygons.forEach((poly, i) => {
        const color = palette[i % palette.length];
        ctx.strokeStyle = `hsl(${color})`;
        ctx.fillStyle = `hsla(${color} / 0.3)`;
        ctx.beginPath();
        poly.points.forEach((pt, idx) => {
          const x = pt.x * canvas.width;
          const y = pt.y * canvas.height;
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      if (current.length > 0) {
        const color = palette[polygons.length % palette.length];
        ctx.strokeStyle = `hsl(${color})`;
        ctx.beginPath();
        current.forEach((pt, idx) => {
          const x = pt.x * canvas.width;
          const y = pt.y * canvas.height;
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        if (hover) {
          ctx.lineTo(hover.x * canvas.width, hover.y * canvas.height);
        }
        ctx.stroke();
      }
    };
    draw();
  }, [polygons, current, selected, image, hover]);

  const deleteCurrent = () => {
    setPolygons(prev => prev.filter((_, i) => i !== selected));
    setSelected(0);
  };

  const deleteAll = () => {
    setPolygons([]);
    setSelected(0);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const move = (e: MouseEvent) => {
      if (current.length === 0) return;
      setHover(getPoint(e));
    };
    const leave = () => setHover(null);
    img.addEventListener('mousemove', move as any);
    img.addEventListener('mouseleave', leave as any);
    return () => {
      img.removeEventListener('mousemove', move as any);
      img.removeEventListener('mouseleave', leave as any);
    };
  }, [current]);

  return (
    <TooltipProvider>
      <div className="inline-block">
        <div
          className="relative inline-block"
          onClick={e => handleClick(e as unknown as MouseEvent)}
        >
          {image && <img ref={imgRef} src={image} alt="imagem" className="block" />}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
        </div>
        <div className="mt-2 flex items-center space-x-2 bg-background/80 p-1 rounded">
          <select
            className="text-xs border rounded px-1 py-0"
            value={selected}
            onChange={e => setSelected(parseInt(e.target.value))}
          >
            {polygons.map((_, i) => (
              <option key={i} value={i}>{`Camada ${i + 1}`}</option>
            ))}
          </select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={deleteCurrent} disabled={polygons.length === 0}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Apagar camada</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={deleteAll} disabled={polygons.length === 0}>
                <Trash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Apagar todas as camadas</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant={invert ? "default" : "ghost"} onClick={() => setInvert(v => !v)}>
                <CircleSlash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bloquear</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default LassoSelector;
