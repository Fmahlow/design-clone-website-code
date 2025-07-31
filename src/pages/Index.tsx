import { useState } from "react";
import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import CompleteRoomSidebar from "@/components/CompleteRoomSidebar";
import translateToEnglish from "@/lib/translate";
import useGenerations from "@/hooks/useGenerations";

const ROOM_OBJECTS: Record<string, string[]> = {
  "sala-estar": ["televisão", "sofá", "rack", "mesa de centro"],
  "sala-jantar": ["mesa", "cadeiras", "aparador", "lustre"],
  "quarto": ["cama", "guarda-roupa", "criado-mudo"],
  "cozinha": ["geladeira", "fogão", "armários", "pia"],
  "banheiro": ["vaso sanitário", "pia", "espelho", "chuveiro"],
};

const ROOM_LABEL: Record<string, string> = {
  "sala-estar": "sala de estar",
  "sala-jantar": "sala de jantar",
  "quarto": "quarto",
  "cozinha": "cozinha",
  "banheiro": "banheiro",
};

const STYLES = [
  "Nenhum",
  "Minimalista",
  "Boêmio",
  "Fazenda",
  "Príncipe Saudita",
  "Neoclássico",
  "Eclético",
  "Parisiense",
  "Hollywood",
  "Escandinavo",
  "Praia",
  "Japonês",
  "Meados do Século Moderno",
  "Retro-futurismo",
  "Texano",
  "Matrix",
];

const STYLE_LABEL: Record<string, string> = STYLES.reduce((acc, s) => {
  const key = s.toLowerCase().replace(/\s+/g, '-');
  acc[key] = s.toLowerCase();
  return acc;
}, {} as Record<string, string>);

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const Index = () => {
  const { addGeneration } = useGenerations();
  const [image, setImage] = useState<string | null>(null);
  const [room, setRoom] = useState<string>("sala-estar");
  const [items, setItems] = useState<string[]>(ROOM_OBJECTS["sala-estar"]);
  const [style, setStyle] = useState<string>("nenhum");
  const [loading, setLoading] = useState(false);

  const handleRoomChange = (r: string) => {
    setRoom(r);
    setItems(ROOM_OBJECTS[r] || []);
  };

  const handleRemoveItem = (it: string) => {
    setItems((prev) => prev.filter((i) => i !== it));
  };

  const handleAddItem = (it: string) => {
    setItems((prev) => [...prev, it]);
  };

  const handleUpload = (dataUrl: string) => {
    setImage(dataUrl);
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const prompt = `${items
        .map((i) => `Adicionar ${i}`)
        .join(", ")}. A ${ROOM_LABEL[room]} deve ficar harmônica e elegante${
        style !== "nenhum" ? ` com estilo ${STYLE_LABEL[style]}` : ""
      }.`;
      const translated = await translateToEnglish(prompt);
      const blob = await fetch(image).then((r) => r.blob());
      const form = new FormData();
      form.append("image", blob, "image.png");
      form.append("prompt", translated);
      const res = await fetch("/flux-edit", { method: "POST", body: form });
      if (!res.ok) throw new Error("failed");
      const outBlob = await res.blob();
      const dataUrl = await blobToDataURL(outBlob);
      setImage(dataUrl);
      addGeneration(dataUrl, null);
    } catch (err) {
      console.error("complete room generation failed", err);
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
          <span className="text-blue-500 font-medium">Completar cômodo</span>
        </nav>
      </div>

      <div className="flex flex-1 items-start overflow-auto">
        <div className="flex-1 flex flex-col px-2 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea onImageSelected={handleUpload} image={image} loading={loading} />
            <PreviousGenerations onSelect={(img) => setImage(img)} />
          </div>
        </div>

        <CompleteRoomSidebar
          className="mr-6 mt-2 self-start flex-none border border-gray-200"
          room={room}
          onRoomChange={handleRoomChange}
          items={items}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
          style={style}
          onStyleChange={setStyle}
          onGenerate={handleGenerate}
          disableGenerate={loading}
        />
      </div>
    </div>
  );
};

export default Index;
