import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";

const Index = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-8 py-4 border-b border-border">
        <nav className="flex items-center space-x-1 text-sm mb-2">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-foreground font-medium">Completar cômodo</span>
        </nav>
        <h1 className="text-lg font-semibold text-foreground">Completar cômodo</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <UploadArea />
          <PreviousGenerations />
        </div>

        <SettingsSidebar />
      </div>
    </div>
  );
};

export default Index;
