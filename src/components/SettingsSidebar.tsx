import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  className?: string;
}

const SettingsSidebar = ({ className }: SettingsSidebarProps) => {
  return (
    <div className={cn("w-80 bg-sidebar-bg p-4 flex flex-col overflow-y-auto self-start", className)}>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center mb-2 space-x-2">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
            <span className="text-sm">2</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Detalhe sua imagem</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
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

        {/* Detalhe as características */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Detalhe as características</Label>
          <Textarea
            placeholder="Digite aqui..."
            className="min-h-[100px] resize-none"
          />
          <div className="text-right">
            <span className="text-xs text-muted-foreground">0/500</span>
          </div>
        </div>
      </div>

        {/* Generate button */}
        <div className="mt-6">
          <Button className="w-full">⚡ Gerar imagem</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
