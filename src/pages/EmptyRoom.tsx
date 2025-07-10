import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";

const EmptyRoom = () => {
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
        <div className="flex-1 flex flex-col px-1 pt-2 pb-8">
          <div className="bg-card rounded-2xl overflow-hidden border border-border w-full max-w-5xl mx-auto">
            <UploadArea />
            <PreviousGenerations />
          </div>
        </div>

        <SettingsSidebar className="mr-2 mt-2 self-start flex-none border border-gray-200" />
      </div>
    </div>
  );
};

export default EmptyRoom;

