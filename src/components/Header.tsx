import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
  } else if (location.pathname === "/generations") {
    pageTitle = "Minhas gerações";
  } else if (location.pathname === "/academy") {
    pageTitle = "Academy";
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-2 bg-card border-b border-border w-screen">
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
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 h-auto"
                      onClick={() => setIsPopoverOpen(true)}
                    >
                      💎 9961
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-[200px] z-[60]"
                >
                  💎 Com Diamantes, você decide onde investir seus créditos na MobilIA
                </TooltipContent>
              </Tooltip>
              <PopoverContent 
                align="end" 
                className="w-80 bg-gray-900 text-white border-gray-700 p-4 rounded-lg z-[60]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Plano Básico</h3>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-xs"
                    >
                      Ver plano
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Meus Diamantes</div>
                    <div className="text-lg font-bold text-blue-400">9961 MobilIA Diamantes</div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="link" 
                      className="text-blue-400 text-xs p-0 h-auto underline hover:text-blue-300"
                      onClick={() => navigate('/profile/diamonds')}
                    >
                      Extrato de transações
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">F</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border border-border z-[60]">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  Meu perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                  <span>Alterar idioma</span>
                  <span className="text-xs">🇺🇸</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Ajuda & feedback
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  Encerrar sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;

