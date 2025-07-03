import { Square, RefreshCw, Home, Clock, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const sidebarItems = [
    { icon: Square, label: "Empty Room", active: true },
    { icon: RefreshCw, label: "Change Objects", active: false },
    { icon: Home, label: "Complete Room", active: false },
    { icon: Clock, label: "Recent", active: false },
    { icon: HelpCircle, label: "Help", active: false },
  ];

  return (
    <TooltipProvider>
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    item.active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;