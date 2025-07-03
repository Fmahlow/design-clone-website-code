import { Square, RefreshCw, Home, Clock, HelpCircle, Grid3X3, Brush } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid3X3, label: "Meus projetos", path: "/projects" },
    { icon: Clock, label: "Minhas gerações", path: "/generations" },
    { icon: HelpCircle, label: "Academy", path: "/academy" },
    { divider: true },
    { icon: Square, label: "Esvaziar Cômodo", path: "/empty-room" },
    { icon: RefreshCw, label: "Alterar objetos", path: "/change-objects" },
    { icon: Brush, label: "Completar Cômodo", path: "/improve-render" },
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
          if ('divider' in item) {
            return <div key={index} className="border-t border-border my-2" />;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center transition-colors px-3 py-2 mx-2 rounded-lg ${
                isActive
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
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;