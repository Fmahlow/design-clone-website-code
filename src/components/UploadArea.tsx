import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface UploadAreaProps {
  onImageSelected?: (dataUrl: string) => void;
  renderPreview?: (img: string) => React.ReactNode;
  image?: string | null;
}

const UploadArea = ({ onImageSelected, renderPreview, image }: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(image ?? null);

  // keep preview in sync when parent controls the image
  useEffect(() => {
    if (image !== undefined) {
      setPreview(image);
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("[UploadArea] Arquivo selecionado", file);
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      console.log("[UploadArea] Pré-visualização gerada");
      setPreview(data);
      console.log("[UploadArea] Chamando onImageSelected");
      onImageSelected?.(data);
    };
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
        {!preview && (
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2 space-x-2">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                <span className="text-sm">1</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Enviar imagem</h2>
            </div>
            <p className="text-muted-foreground text-xs">
              Faça upload da sua imagem em PNG ou JPEG e siga para as próximas etapas
              para gerar suas imagens.
            </p>
          </div>
        )}

        {/* Upload area with prompt, preview and button inside larger dashed box */}
        <div className="bg-card rounded-xl px-8 py-4 text-center mb-1 mx-auto max-w-5xl">
          <div
            className={`relative w-full ${preview ? '' : 'h-[32rem]'} border-dashed border-2 border-muted rounded-lg ${!preview ? 'cursor-pointer' : ''} overflow-hidden flex items-center justify-center`}
            onClick={() => !preview && fileInputRef.current?.click()}
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
                renderPreview ? (
                  renderPreview(preview)
                ) : (
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className="rounded-lg block"
                  />
                )
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
