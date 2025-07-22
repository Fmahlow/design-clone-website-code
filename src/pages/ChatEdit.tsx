import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import DescriptionSidebar from "@/components/DescriptionSidebar";
import { useState } from "react";
import translateToEnglish from "@/lib/translate";
import useGenerations from "@/hooks/useGenerations";

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const ChatEdit = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { addGeneration } = useGenerations();

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
  };

  const handleGenerate = async () => {
    if (!image || !description) return;
    setLoading(true);
    try {
      const blob = await fetch(image).then(r => r.blob());
      const form = new FormData();
      form.append("image", blob, "image.png");
      const translated = await translateToEnglish(description);
      form.append("prompt", translated);
      const res = await fetch("/flux-edit", { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed to generate");
      const outBlob = await res.blob();
      const dataUrl = await blobToDataURL(outBlob);
      setImage(dataUrl);
      addGeneration(dataUrl);
    } catch (err) {
      console.error("chat edit failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="px-4 py-1">
          <nav className="flex items-center space-x-1 text-xs mb-0">
            <span className="text-muted-foreground">Home</span>
            <span className="mx-2 text-muted-foreground">{'>'}</span>
            <span className="text-blue-500 font-medium">Edição por Chat</span>
          </nav>
      </div>

      <div className="flex flex-1 items-start overflow-auto">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea onImageSelected={handleUpload} image={image} loading={loading} />
            <PreviousGenerations onSelect={(img) => setImage(img)} />
          </div>
        </div>

        <DescriptionSidebar
          description={description}
          onDescriptionChange={setDescription}
          onGenerate={handleGenerate}
          disableGenerate={loading}
          className="mr-6 mt-2 self-start flex-none"
        />
      </div>
    </div>
  );
};

export default ChatEdit;
