import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGenerations from "@/hooks/useGenerations";

const Generations = () => {
  const { generations } = useGenerations();
  const [sortBy, setSortBy] = useState("newest");

  const sortedGenerations = [...generations].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Breadcrumb */}
      <div className="px-4 py-1">
        <nav className="flex items-center space-x-1 text-xs mb-0">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2 text-muted-foreground">{'>'}</span>
          <span className="text-blue-500 font-medium">Minhas gerações</span>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Data de edição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Data de edição</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sortedGenerations.map(item => (
              <div
                key={item.id}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={`Generation ${item.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generations;