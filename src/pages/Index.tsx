import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";

const Index = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-8 py-2">
          <nav className="flex items-center space-x-1 text-xs mb-1">
            <span className="text-muted-foreground">Home</span>
            <span className="mx-2 text-muted-foreground">{'>'}</span>
            <span className="text-blue-500 font-medium">Completar cômodo</span>
          </nav>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto px-8 pt-4 pb-8 mr-8">
          <div className="bg-card rounded-2xl overflow-hidden w-full max-w-3xl mx-auto">
            <UploadArea />
            <PreviousGenerations />
          </div>
        </div>

        <SettingsSidebar />
      </div>
    </div>
  );
};

export default Index;

