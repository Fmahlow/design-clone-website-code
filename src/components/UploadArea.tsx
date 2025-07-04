import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface UploadAreaProps {
  onImageSelected?: (file: File) => void;
}

const UploadArea = ({ onImageSelected }: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="p-10">
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
        <div className="bg-card rounded-xl p-8 text-center mb-8 max-w-lg mx-auto">
          <div className="flex flex-col items-center space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Pré-visualização"
                className="max-h-64 object-contain rounded-lg border"
              />
            )}
            
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setPreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                  onImageSelected?.(file);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
