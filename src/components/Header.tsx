import { Home, Zap, Grid3X3, Clock, HelpCircle, Maximize } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        
        <nav className="flex items-center space-x-1 text-sm">
          <span className="text-muted-foreground">Home</span>
          <span className="text-muted-foreground mx-2">{'>'}</span>
          <span className="text-foreground font-medium">Melhorar render</span>
        </nav>
      </div>

      {/* Center */}
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold text-foreground">Melhorar render</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>Assinatura • Expira em 08/04/2025</span>
          </div>
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
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