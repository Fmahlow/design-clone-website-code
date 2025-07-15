import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { label: "Perfil", path: "/profile", isActive: currentPath === "/profile" },
    { label: "Dados pessoais", path: "/profile/personal-data", isActive: currentPath === "/profile/personal-data" },
    { label: "Plano e faturamento", path: "/profile/billing", isActive: currentPath === "/profile/billing" },
    { label: "Meus Diamantes", path: "/profile/diamonds", isActive: currentPath === "/profile/diamonds" },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-blue-500 font-medium">Meu perfil</span>
        </nav>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-background border-r border-border p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  item.isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Default profile overview page
const ProfileOverview = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Perfil do usuário</h1>
      
      {/* User info card */}
      <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 bg-white/20">
            <AvatarFallback className="text-white text-2xl font-bold">F</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Felipe Mahlow</h2>
            <p className="text-white/90">felipe.mahlow@gmail.com</p>
          </div>
        </div>
      </div>

      {/* My plan section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Meu plano</h3>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não possui um plano ativo</p>
          <Button className="bg-primary hover:bg-primary/90">
            Assinar um plano
          </Button>
        </div>
      </div>

      {/* Bonifications section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Minhas bonificações</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">bonificação #voltaredraw</p>
              <p className="text-xs text-muted-foreground">Disponível até: 11 de agosto de 2024</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              0/100 💎
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
export { ProfileOverview };