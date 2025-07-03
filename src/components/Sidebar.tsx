import { Zap, Grid3X3, Clock, HelpCircle, Maximize } from "lucide-react";

const Sidebar = () => {
  const sidebarItems = [
    { icon: Zap, active: true },
    { icon: Grid3X3, active: false },
    { icon: Clock, active: false },
    { icon: HelpCircle, active: false },
    { icon: Maximize, active: false },
  ];

  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              item.active 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;