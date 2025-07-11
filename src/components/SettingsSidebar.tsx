import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  className?: string;
  objects?: string[];
  onRemoveObject?: (obj: string) => void;
  onGenerate?: () => void;
  disableGenerate?: boolean;
}

const SettingsSidebar = ({ className, objects = [], onRemoveObject, onGenerate, disableGenerate }: SettingsSidebarProps) => {
  return (
    <div className={cn("w-[25%] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch", className)}>
        <div className="flex items-center justify-center mb-2 space-x-2">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
            <span className="text-sm">2</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground text-center">Detalhe sua imagem</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Descreva essa imagem aqui
        </p>

      <div className="space-y-6">
        {/* Ambiente */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Ambiente</Label>
          <Select defaultValue="interior">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sala-estar">Sala de estar</SelectItem>
              <SelectItem value="sala-jantar">Sala de jantar</SelectItem>
              <SelectItem value="quarto">Quarto</SelectItem>
              <SelectItem value="cozinha">Cozinha</SelectItem>
              <SelectItem value="banheiro">Banheiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Objetos a excluir */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Objetos a excluir</Label>
          <Textarea
            placeholder="Digite aqui..."
            className="min-h-[100px] resize-none"
            readOnly
            value={objects.join(', ')}
          />
          {objects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {objects.map(obj => (
                <span key={obj} className="bg-muted rounded px-2 py-1 text-xs flex items-center space-x-1">
                  <span>{obj}</span>
                  {onRemoveObject && (
                    <button onClick={() => onRemoveObject(obj)} className="text-destructive hover:underline">
                      x
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default SettingsSidebar;
