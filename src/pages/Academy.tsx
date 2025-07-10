import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Item {
  title: string;
  url?: string;
}

const videoCategories: Record<string, Item[]> = {
  "Introdução": [
    { title: "Bem-vindo ao Academy", url: "#" },
    { title: "Visão geral das ferramentas", url: "#" },
  ],
  "Tutoriais": [
    { title: "Como criar seu primeiro projeto", url: "#" },
    { title: "Dicas de otimização", url: "#" },
  ],
  "Dicas Avançadas": [
    { title: "Automatizando fluxos", url: "#" },
  ],
};

const articleCategories: Record<string, Item[]> = {
  "Configuração": [
    { title: "Primeiros passos", url: "#" },
    { title: "Opções de personalização", url: "#" },
  ],
  "FAQ": [
    { title: "Perguntas frequentes", url: "#" },
  ],
  "Troubleshooting": [
    { title: "Resolvendo problemas comuns", url: "#" },
  ],
};

const Academy = () => {
  const [search, setSearch] = useState("");

  const filterCategories = (cats: Record<string, Item[]>) =>
    Object.entries(cats).filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    );

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
        <div className="max-w-7xl mx-auto">
          <Input
            placeholder="Buscar categoria"
            className="mb-4 max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Tabs defaultValue="videos" className="mt-4">
            <TabsList>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="articles">Artigos</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-4">
              <Accordion type="multiple">
                {filterCategories(videoCategories).map(([cat, items]) => (
                  <AccordionItem key={cat} value={cat}>
                    <AccordionTrigger>{cat}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {items.map((item, idx) => (
                          <li key={idx}>
                            <a
                              href={item.url}
                              className="text-blue-500 hover:underline text-sm"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="articles" className="mt-4">
              <Accordion type="multiple">
                {filterCategories(articleCategories).map(([cat, items]) => (
                  <AccordionItem key={cat} value={cat}>
                    <AccordionTrigger>{cat}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {items.map((item, idx) => (
                          <li key={idx}>
                            <a
                              href={item.url}
                              className="text-blue-500 hover:underline text-sm"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Academy;
