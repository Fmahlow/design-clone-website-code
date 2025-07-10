import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const UploadArea = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2 space-x-2">
            <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
              <span className="text-sm">1</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Envie uma imagem
            </h2>
          </div>
          <p className="text-muted-foreground text-xs">
            Faça upload da sua imagem em PNG ou JPEG e siga para as próximas etapas
            para gerar suas imagens.
          </p>
        </div>

        {/* Upload area with prompt, preview and button inside larger dashed box */}
        <div className="bg-card rounded-xl px-8 py-4 text-center mb-1 mx-auto max-w-5xl">
          <div
            className="relative w-full h-[32rem] border-dashed border-2 border-muted rounded-lg cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Remove button */}
            {preview && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 z-10 h-8 w-8 p-0"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {/* Inner content: prompt or preview */}
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
              {!preview && (
                <>
                  <h3 className="text-base font-medium text-foreground">
                    Para completar o cômodo da sua imagem, arraste um arquivo
                    ou clique abaixo:
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Ou clique no botão abaixo para enviar
                  </p>
                </>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}

              {/* Upload button inside dashed area only when no preview */}
              {!preview && (
                <Button
                  variant="gradient"
                  className="mt-4 inline-flex items-center"
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar arquivo
                </Button>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
