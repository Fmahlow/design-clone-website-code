import { Armchair, PackagePlus, Home, Clock, HelpCircle, Grid3X3, BrushCleaning} from "lucide-react";
import logo from "./logo.png";
import nameLogo from "./name_logo.png";
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
      <div
        className={`py-2 space-y-0 flex flex-col transition-all ${
          isExpanded ? 'items-start pl-2' : 'items-center'
        }`}
      >
        <div
          className={`flex items-center w-full transition-all mb-4 ${
            isExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <img src={logo} alt="Logo" className="w-10 h-10 ml-2" />
          <img
            src={nameLogo}
            alt="Name Logo"
            className={`ml-2 h-6 transition-all duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          />
        </div>
        {sidebarItems.map((item, index) => {
          if ('divider' in item) {
            return (
              <div
                key={index}
                className={`border-t border-border my-12 ml-4 mr-4 transition-all duration-300 ${
                  isExpanded ? 'w-[calc(100%-2rem)]' : 'w-8'
                }`}
              />
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center transition-colors px-2 py-1 mx-1 rounded-lg w-[calc(100%-0.5rem)] ${
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
