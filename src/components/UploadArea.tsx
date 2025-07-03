import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const UploadArea = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2 space-x-2">
            <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
              <span className="text-sm">1</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">Envie uma imagem</h2>
          </div>
          <p className="text-muted-foreground text-xs">
            Faça upload da sua imagem em PNG ou JPEG e siga para as próximas etapas para gerar suas imagens.
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-card rounded-xl p-8 text-center mb-8 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-4">
            
            <h3 className="text-base font-medium text-foreground">
              Para começar completar o cômodo da sua imagem
              <br />
              arraste um arquivo
            </h3>

            <p className="text-muted-foreground text-xs">
              Ou clique no botão abaixo para enviar
            </p>
            
            <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Enviar arquivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
