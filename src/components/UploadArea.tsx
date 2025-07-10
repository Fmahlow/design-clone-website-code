import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface UploadAreaProps {
  /**
   * Called when the user selects an image. The base64 encoded image is passed
   * as a parameter.
   */
  onImageSelected?: (dataUrl: string) => void;
  /**
   * Allows custom rendering of the uploaded preview. When provided, this
   * function receives the image data URL and should return the element to be
   * displayed instead of the default <img> preview.
   */
  renderPreview?: (image: string) => React.ReactNode;
}

const UploadArea = ({ onImageSelected, renderPreview }: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        <div
          className={`bg-card rounded-xl text-center mb-8 w-full max-w-5xl mx-auto relative ${
            preview ? "p-4" : "p-8"
          }`}
        >
          {preview && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-3 right-3 z-10 h-8 w-8 p-0"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <div className="flex flex-col items-center space-y-4 h-full">
            {preview && (
              <div className="w-full h-full flex items-center justify-center">
                {renderPreview ? (
                  renderPreview(preview)
                ) : (
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
              </div>
            )}

            {!preview && (
              <>
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
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const result = ev.target?.result as string;
                    setPreview(result);
                    onImageSelected?.(result);
                  };
                  reader.readAsDataURL(file);
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
