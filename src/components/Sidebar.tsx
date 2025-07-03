import { Armchair, PackagePlus, Home, Clock, HelpCircle, Grid3X3 } from "lucide-react";
import Broom from "./icons/Broom";
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
    { icon: HelpCircle, label: "Academy", path: "/academy" },
    { divider: true },
    { icon: Broom, label: "Esvaziar Cômodo", path: "/empty-room" },
    { icon: Armchair, label: "Alterar objetos", path: "/change-objects" },
    { icon: PackagePlus, label: "Completar Cômodo", path: "/improve-render" },
  ];

  return (
    <div
      className={`sticky top-0 h-screen z-50 bg-card border-r border-border flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-4 space-y-1 flex flex-col items-center">
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
              className={`w-full flex items-center transition-colors px-3 py-2 mx-2 rounded-lg ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              } ${!isExpanded ? 'justify-center' : ''}`}
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