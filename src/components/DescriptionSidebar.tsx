import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DescriptionSidebarProps {
  className?: string;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  onGenerate?: () => void;
  disableGenerate?: boolean;
  hideDescription?: boolean;
}

const DescriptionSidebar = ({
  className,
  description = "",
  onDescriptionChange,
  onGenerate,
  disableGenerate,
  hideDescription,
}: DescriptionSidebarProps) => {
  return (
    <div className={cn("w-[25%] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch", className)}>
      <div className="flex items-center justify-center mb-2 space-x-2">
        <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
          <span className="text-sm">2</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground text-center">Detalhe sua imagem</h2>
      </div>
      {!hideDescription && (
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
          </div>
        </>
      )}

      {/* Generate button */}
      {onGenerate && (
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