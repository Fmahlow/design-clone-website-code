import { Armchair, PackagePlus, Home, Clock, HelpCircle, Grid3X3 } from "lucide-react";
import BrushCleaning from "./icons/BrushCleaning";
import logo from "./logo.png";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid3X3, label: "Meus projetos", path: "/projects" },
    { icon: Clock, label: "Minhas gerações", path: "/generations" },
    { divider: true },
    { icon: HelpCircle, label: "Academy", path: "/academy" },
    { divider: true },
    { icon: BrushCleaning, label: "Esvaziar Cômodo", path: "/empty-room" },
    { icon: Armchair, label: "Alterar objetos", path: "/change-objects" },
    { icon: PackagePlus, label: "Completar Cômodo", path: "/improve-render" },
  ];

  return (
    <div
      className={`sticky top-0 h-screen z-50 bg-card border-r border-border flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-48' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-2 space-y-0 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-10 h-10 mb-4" />
        {sidebarItems.map((item, index) => {
          if ('divider' in item) {
            return <div key={index} className="border-t border-border my-4" />;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center transition-colors px-2 py-1 mx-1 rounded-lg ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-primary/50 hover:text-primary'
              } ${!isExpanded ? 'justify-center' : ''}`}
            >
              <div className="flex items-center justify-center w-8 h-8 shrink-0">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              </div>

              {isExpanded && (
                <span className="ml-3 text-xs font-medium whitespace-nowrap overflow-hidden">
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
