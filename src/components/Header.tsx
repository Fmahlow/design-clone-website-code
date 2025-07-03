import { Zap } from "lucide-react";

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
        
        {/* Navigation moved inside the page */}
      </div>

      {/* Center intentionally empty */}
      <div />

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>Assinatura • Expira em xx/xx/2025</span>
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