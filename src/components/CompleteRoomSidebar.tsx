import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { cn } from "@/lib/utils";


interface CompleteRoomSidebarProps {
  className?: string;
  room: string;
  onRoomChange?: (room: string) => void;
  items: string[];
  onRemoveItem?: (item: string) => void;
  onAddItem?: (item: string) => void;
  /* Temporarily remove style options */
  onGenerate?: () => void;
  disableGenerate?: boolean;
}

const CompleteRoomSidebar = ({
  className,
  room,
  onRoomChange,
  items,
  onRemoveItem,
  onAddItem,
  onGenerate,
  disableGenerate,
}: CompleteRoomSidebarProps) => {
  const [newItem, setNewItem] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = newItem.trim();
      if (value) {
        onAddItem?.(value);
        setNewItem("");
      }
    }
  };
  return (
    <div className={cn("w-[25%] mr-8 bg-card rounded-2xl p-4 flex flex-col overflow-y-auto self-stretch", className)}>
      <div className="flex items-center justify-center mb-2 space-x-2">
        <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
          <span className="text-sm">2</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground text-center">Detalhe sua imagem</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Escolha o cômodo e os móveis que deseja adicionar
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Cômodo</Label>
          <Select value={room} onValueChange={onRoomChange}>
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

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Móveis sugeridos</Label>
          <Input
            placeholder="Digite e pressione Enter"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {items.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {items.map((item) => (
                <span key={item} className="bg-muted rounded px-2 py-1 text-xs flex items-center space-x-1">
                  <span>{item}</span>
                  {onRemoveItem && (
                    <button onClick={() => onRemoveItem(item)} className="text-destructive hover:underline">
                      x
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {onGenerate && (
        <div className="mt-6">
          <Button variant="gradient" className="w-full flex items-center justify-center" onClick={onGenerate} disabled={disableGenerate}>
            Gerar imagem
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompleteRoomSidebar;
