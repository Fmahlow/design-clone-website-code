import { Armchair, PackagePlus } from "lucide-react";
import BrushCleaning from "@/components/icons/BrushCleaning";
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
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-8 px-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creationTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className={`group hover:shadow-lg transition-shadow cursor-pointer ${tool.featured ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${tool.featured ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {tool.beta && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          BETA
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      {tool.description}
                    </CardDescription>
                    <Link to={tool.link}>
                      <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
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