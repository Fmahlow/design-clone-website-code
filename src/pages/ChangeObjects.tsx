import UploadArea from "@/components/UploadArea";
import PreviousGenerations from "@/components/PreviousGenerations";
import ObjectGallery from "@/components/ObjectGallery";

const ChangeObjects = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-8 py-2 border-b border-border">
        <nav className="flex items-center space-x-1 text-xs mb-1">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-foreground font-medium">Alterar objetos</span>
        </nav>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <UploadArea />
          <PreviousGenerations />
        </div>

        <ObjectGallery className="-ml-[50px]" />
      </div>
    </div>
  );
};

export default ChangeObjects;
