import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SettingsSidebar = () => {
  return (
    <div className="w-80 bg-sidebar-bg border-l border-border p-6 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm">2</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Detalhe sua imagem</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Descreva essa imagem aqui
      </p>

      <div className="space-y-6 flex-1">
        {/* Motor */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Motor</Label>
          <Select defaultValue="v2">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">v1</SelectItem>
              <SelectItem value="v2">v2</SelectItem>
              <SelectItem value="v3">v3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ambiente */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Ambiente</Label>
          <Select defaultValue="interior">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interior">Interior</SelectItem>
              <SelectItem value="exterior">Exterior</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Intensidade do Fotorrealismo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Intensidade do Fotorrealismo</Label>
            <span className="text-sm text-muted-foreground">1</span>
          </div>
          <Slider
            defaultValue={[1]}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
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
      <div className="pt-6 border-t border-border">
        <Button className="w-full">
          ⚡ Gerar imagem
        </Button>
      </div>
    </div>
  );
};

export default SettingsSidebar;