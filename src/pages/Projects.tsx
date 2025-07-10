import { useState, useRef } from "react";
import { Folder, Pencil, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ImageItem {
  id: number;
  url: string;
}

interface Project {
  id: number;
  name: string;
  images: ImageItem[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Projeto 1",
      images: [
        { id: 1, url: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png" },
      ],
    },
    { id: 2, name: "Projeto 2", images: [] },
  ]);

  const [selected, setSelected] = useState<Project | null>(null);
  const [newName, setNewName] = useState("Novo projeto");
  const [renameName, setRenameName] = useState("");
  const [renameId, setRenameId] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const createProject = () => {
    setProjects((prev) => [
      ...prev,
      { id: Date.now(), name: newName || "Novo projeto", images: [] },
    ]);
    setNewName("Novo projeto");
  };

  const renameProject = () => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === renameId ? { ...p, name: renameName || p.name } : p
      )
    );
    setRenameId(null);
  };

  const addImages = (files: FileList | null) => {
    if (!files || !selected) return;
    const imgs: ImageItem[] = Array.from(files).map((f) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(f),
    }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selected.id ? { ...p, images: [...p.images, ...imgs] } : p
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-blue-500 font-medium">Meus projetos</span>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {!selected && (
            <div className="mb-4 flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />Novo projeto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo projeto</DialogTitle>
                  </DialogHeader>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-4"
                  />
                  <DialogFooter className="mt-4">
                    <Button onClick={createProject}>Criar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {selected ? (
            <div>
              <div className="flex items-center mb-4 gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelected(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setRenameId(selected.id);
                    setRenameName(selected.name);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <div className="mb-4">
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => addImages(e.target.files)}
                />
                <Button size="sm" onClick={() => fileInput.current?.click()}>
                  <Plus className="w-4 h-4 mr-2" />Adicionar imagens
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {selected.images.map((img) => (
                  <div key={img.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="relative p-4 border rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => setSelected(p)}
                >
                  <Folder className="w-8 h-8 mx-auto text-primary" />
                  <div className="mt-2 text-center text-sm break-all">{p.name}</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-1 right-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameId(p.id);
                      setRenameName(p.name);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={renameId !== null} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear projeto</DialogTitle>
          </DialogHeader>
          <Input
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button onClick={renameProject}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
