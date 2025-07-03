import { Square, RefreshCw, Home, Clock, HelpCircle, Grid3X3, Maximize, Brush, Zap } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { icon: Square, label: "Empty Room", active: true },
    { icon: RefreshCw, label: "Change Objects", active: false },
    { icon: Home, label: "Complete Room", active: false },
    { icon: Grid3X3, label: "Meus projetos", active: false },
    { icon: Clock, label: "Minhas gerações", active: false },
    { icon: Zap, label: "Renderizar imagens", active: false },
    { icon: Brush, label: "Melhorar render", active: false },
    { icon: Maximize, label: "Aumentar resolução", active: false },
    { icon: HelpCircle, label: "Academy", active: false },
  ];

  return (
    <div 
      className={`bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-4 space-y-1">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center transition-colors px-3 py-2 mx-2 rounded-lg ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              
              {isExpanded && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;