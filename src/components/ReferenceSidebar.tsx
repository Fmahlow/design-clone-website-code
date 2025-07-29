import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

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
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    onImageSelected?.(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  return (
    <div
      className={cn(
        "w-[420px] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch border border-border",
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-2 pr-6">
        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
            <span className="text-sm">3</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground text-center">Imagem de referência (opcional)</h2>
        </div>
        {onToggleCollapse && (
          <button className="p-1 absolute right-0" onClick={onToggleCollapse}>
            {collapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {!collapsed && (
        <>
          <div className="space-y-2 mb-4">
            <Label className="text-sm font-medium text-foreground">Enviar imagem de referência</Label>
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div className="mt-2 flex justify-center">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className="max-h-32 rounded object-contain"
                  />
                  <button
                    className="absolute top-1 right-1 bg-background/70 rounded-full p-1"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      onImageSelected?.(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
