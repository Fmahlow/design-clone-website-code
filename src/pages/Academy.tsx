import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = ["Decoração", "Projetos", "Dicas", "Tutoriais"];

const Academy = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-blue-500 font-medium">Academy</span>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="articles">Artigos</TabsTrigger>
            </TabsList>
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Card key={cat}>
                    <CardHeader>
                      <CardTitle>{cat}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Conteúdo de vídeos sobre {cat}.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="articles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Card key={cat}>
                    <CardHeader>
                      <CardTitle>{cat}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Lista de artigos sobre {cat}.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Academy;
