import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";

const Index = () => {
  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <UploadArea />
        <PreviousGenerations />
      </div>
      
      <SettingsSidebar />
    </div>
  );
};

export default Index;
