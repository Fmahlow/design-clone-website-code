import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Check, X as XIcon, Upload } from "lucide-react";
import { useState, useRef } from "react";

interface DescriptionSidebarProps {
  className?: string;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  onGenerate?: () => void;
  disableGenerate?: boolean;
  hideDescription?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DescriptionSidebar = ({
  className,
  description = "",
  onDescriptionChange,
  onGenerate,
  disableGenerate,
  hideDescription,
  collapsed,
  onToggleCollapse,
}: DescriptionSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addRef, setAddRef] = useState<'sim' | 'nao'>('nao');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
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
            <span className="text-sm">2</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground text-center">Detalhe sua imagem</h2>
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
      {!collapsed && !hideDescription && (
        <>
          <p className="text-sm text-muted-foreground mb-6 text-center">Descreva o que quer mudar</p>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Descreva o que quer mudar</Label>
              <Textarea
                placeholder="Digite aqui o que você quer alterar na imagem..."
                className="min-h-[150px] resize-none"
                value={description}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Adicionar imagem de referência?</Label>
                <ToggleGroup
                  type="single"
                  value={addRef}
                  onValueChange={(v) => v && setAddRef(v as 'sim' | 'nao')}
                  size="sm"
                  className="inline-flex gap-1 p-1 border border-border rounded-md bg-gray-50"
                >
                  {(['sim', 'nao'] as const).map((v) => {
                    const Icon = v === 'sim' ? Check : XIcon;
                    return (
                      <ToggleGroupItem
                        key={v}
                        value={v}
                        className={cn(
                          'w-8 h-8 p-0 flex items-center justify-center text-gray-600',
                          'hover:bg-muted/50 focus-visible:ring-white',
                          'data-[state=on]:bg-white data-[state=on]:text-black'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>
              {addRef === 'sim' && (
                <>
                  {!preview && (
                    <div className="p-4 rounded-lg border-2 border-dashed border-primary bg-white text-center space-y-2 w-72 mx-auto">
                      <p className="text-xs text-muted-foreground">Arraste ou clique no botão abaixo para enviar</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-gray-300 bg-white hover:bg-white hover:brightness-110 text-foreground rounded-lg inline-flex items-center"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Enviar arquivo
                      </Button>
                    </div>
                  )}
                  <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {preview && (
                    <div className="mt-2 flex justify-center">
                      <div className="relative">
                        <img src={preview} alt="Pré-visualização" className="max-h-32 rounded object-contain" />
                        <button
                          className="absolute top-1 right-1 bg-background/70 rounded-full p-1"
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {!collapsed && onGenerate && (
        <div className="mt-6">
          <Button variant="gradient" className="w-full flex items-center justify-center" onClick={onGenerate} disabled={disableGenerate}>
            Gerar imagem
            <span className="relative ml-2">
              <span className="text-lg">💎</span>
              <span className="absolute -top-1 -right-2 bg-background text-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DescriptionSidebar;
