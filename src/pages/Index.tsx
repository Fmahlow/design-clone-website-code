import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UploadArea from "@/components/UploadArea";
import SettingsSidebar from "@/components/SettingsSidebar";
import PreviousGenerations from "@/components/PreviousGenerations";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <UploadArea />
            <PreviousGenerations />
          </div>
          
          <SettingsSidebar />
        </div>
      </div>
    </div>
  );
};

export default Index;
