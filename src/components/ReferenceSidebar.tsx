import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface ReferenceSidebarProps {
  className?: string;
  onGenerate?: () => void;
  disableGenerate?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onImageSelected?: (file: File | null) => void;
}

const ReferenceSidebar = ({
  className,
  onGenerate,
  disableGenerate,
  collapsed,
  onToggleCollapse,
  onImageSelected,
}: ReferenceSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    onImageSelected?.(f);
  };

  return (
    <div className={cn("w-[320px] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
            <span className="text-sm">3</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Imagem de referência (opcional)</h2>
        </div>
        {onToggleCollapse && (
          <button className="p-1" onClick={onToggleCollapse}>
            {collapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        )}
      </div>
      {!collapsed && (
        <>
          <div className="space-y-2 mb-4">
            <Label className="text-sm font-medium text-foreground">Enviar imagem de referência</Label>
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {onGenerate && (
            <Button
              variant="gradient"
              className="w-full flex items-center justify-center mt-auto"
              onClick={onGenerate}
              disabled={disableGenerate}
            >
              Gerar imagem
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ReferenceSidebar;
