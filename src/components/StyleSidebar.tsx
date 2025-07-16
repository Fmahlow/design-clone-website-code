import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StyleSidebarProps {
  className?: string;
  disableGenerate?: boolean;
  onGenerate?: (style: string) => void;
}

const styles = [
  "Nenhum",
  "Minimalista",
  "Boêmio",
  "Fazenda",
  "Príncipe Saudita",
  "Neoclássico",
  "Eclético",
  "Parisiense",
  "Hollywood",
  "Escandinavo",
  "Praia",
  "Japonês",
  "Meados do Século Moderno",
  "Retro-futurismo",
  "Texano",
  "Matrix",
];

const StyleSidebar = ({ className, disableGenerate, onGenerate }: StyleSidebarProps) => {
  const [style, setStyle] = useState("nenhum");

  const handleGenerate = () => {
    onGenerate?.(style);
  };

  return (
    <div className={cn("w-[25%] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch", className)}>
      <div className="flex items-center justify-center mb-2 space-x-2">
        <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
          <span className="text-sm">2</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground text-center">Detalhe sua imagem</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center">Descreva essa imagem aqui</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Descreva o seu design</Label>
          <Textarea placeholder="Digite aqui..." className="min-h-[100px] resize-none" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Estilo</Label>
          <Select defaultValue="Nenhum" onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style} value={style.toLowerCase().replace(/\s+/g, '-')}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {onGenerate && (
        <div className="mt-6">
          <Button
            variant="gradient"
            className="w-full flex items-center justify-center"
            onClick={handleGenerate}
            disabled={disableGenerate}
          >
            Mudar Estilo
          </Button>
        </div>
      )}
    </div>
  );
};

export default StyleSidebar;
