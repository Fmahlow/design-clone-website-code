import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";
import { useState } from "react";

const EmptyRoom = () => {
  const [image, setImage] = useState<string | null>(null);
  const [objects, setObjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (dataUrl: string) => {
    setImage(dataUrl);
    setObjects([]);
    setLoading(true);
    const blob = await (await fetch(dataUrl)).blob();
    const form = new FormData();
    form.append('image', blob, 'image.png');
    try {
      const res = await fetch('/api/detect', { method: 'POST', body: form });
      const json = await res.json();
      setObjects(json.objects || []);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (obj: string) => {
    setObjects(objects.filter(o => o !== obj));
  };

  const handleGenerate = async () => {
    if (!image) return;
    const blob = await (await fetch(image)).blob();
    const form = new FormData();
    form.append('image', blob, 'image.png');
    objects.forEach(o => form.append('objects', o));
    await fetch('/api/edit', { method: 'POST', body: form });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-1">
          <nav className="flex items-center space-x-1 text-xs mb-0">
            <span className="text-muted-foreground">Home</span>
            <span className="mx-2 text-muted-foreground">{'>'}</span>
            <span className="text-blue-500 font-medium">Esvaziar cômodo</span>
          </nav>
      </div>

      <div className="flex flex-1 items-start">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea
              onImageSelected={handleUpload}
              renderPreview={(img) => (
                <div className="w-full h-full relative">
                  <img src={img} alt="Pré-visualização" className="w-full h-full object-cover rounded-lg" />
                  {loading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
            />
            <PreviousGenerations />
          </div>
        </div>

        <SettingsSidebar
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
          objects={objects}
          onRemoveObject={handleRemove}
          onGenerate={handleGenerate}
          disableGenerate={loading}
        />
      </div>
    </div>
  );
};

export default EmptyRoom;

