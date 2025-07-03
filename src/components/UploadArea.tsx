import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadArea = () => {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mb-4">
            <span className="text-sm">1</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Envie uma imagem</h2>
          <p className="text-muted-foreground">
            Faça upload da sua imagem em PNG ou JPEG e siga para as próximas etapas para gerar suas imagens.
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-upload-area border-2 border-dashed border-upload-border rounded-xl p-12 text-center mb-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="w-16 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-12 bg-muted rounded-lg"></div>
            </div>
            
            <h3 className="text-lg font-medium text-foreground">
              Para começar renderizar a sua imagem
              <br />
              arraste um arquivo
            </h3>
            
            <p className="text-muted-foreground text-sm">
              Ou clique no botão abaixo para enviar
            </p>
            
            <Button className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Enviar arquivo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;