import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  let pageTitle = "";
  let showGreeting = false;

  if (location.pathname === "/") {
    showGreeting = true;
  } else if (location.pathname === "/improve-render") {
    pageTitle = "Completar cômodo";
  } else if (location.pathname === "/empty-room") {
    pageTitle = "Esvaziar cômodo";
  } else if (location.pathname === "/change-objects") {
    pageTitle = "Alterar objetos";
  }

  return (
    <header className="flex items-center justify-between px-6 py-2 bg-card border-b border-border">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        {showGreeting ? (
          <div className="leading-tight">
            <p className="text-sm font-medium">Olá Felipe Mahlow!</p>
            <p className="text-xs text-muted-foreground">O que você deseja criar hoje?</p>
          </div>
        ) : (
          pageTitle && (
            <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          )
        )}
      </div>

      {/* Center intentionally empty */}
      <div />

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-md text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>Assinatura • Expira em xx/xx/2025</span>
          </div>
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            💎 9961
          </div>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">F</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

