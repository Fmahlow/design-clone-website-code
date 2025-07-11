import { Armchair, PackagePlus, BrushCleaning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Home = () => {
  const creationTools = [
    {
      icon: BrushCleaning,
      title: "Esvaziar Cômodo",
      description: "Remova todos os móveis de uma foto e comece do zero.",
      link: "/empty-room"
    },
    {
      icon: Armchair,
      title: "Alterar objetos",
      description: "Substitua itens da imagem por móveis diferentes.",
      link: "/change-objects"
    },
    {
      icon: PackagePlus,
      title: "Completar Cômodo",
      description: "Adicione móveis e decoração automaticamente ao ambiente.",
      link: "/improve-render"
    },
    // Removed obsolete tools
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-8 px-8 m-4 rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Adicionar aqui o banner!</h1>
            </div>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Soluções para design de interiores</h2>
                <p className="text-purple-100">
                  Esvazie cômodos, altere objetos e complete ambientes em segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Tools */}
      <div className="py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Ferramentas de criação</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {creationTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer w-full min-h-fit">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs sm:text-sm leading-relaxed mb-4">
                      {tool.description}
                    </CardDescription>
                    <Link to={tool.link}>
                      <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary w-full sm:w-auto">
                        Começar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;