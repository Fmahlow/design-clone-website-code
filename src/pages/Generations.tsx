import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";

const Generations = () => {
  const [sortBy, setSortBy] = useState("newest");
  
  // Sample data for the gallery
  const generations = [
    { id: 1, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-15" },
    { id: 2, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: true, duration: "0:01", date: "2024-01-14" },
    { id: 3, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-13" },
    { id: 4, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-12" },
    { id: 5, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: true, duration: "0:01", date: "2024-01-11" },
    { id: 6, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-10" },
    { id: 7, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-09" },
    { id: 8, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-08" },
    { id: 9, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: true, duration: "0:01", date: "2024-01-07" },
    { id: 10, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-06" },
    { id: 11, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-05" },
    { id: 12, image: "/lovable-uploads/6f14cc5d-61a0-4cdb-bd97-a5d2509b2f5a.png", isVideo: false, date: "2024-01-04" },
  ];

  const sortedGenerations = [...generations].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
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
          {/* Header */}
          <h1 className="text-2xl font-bold text-foreground mb-6">Minhas gerações</h1>

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

            <Button 
              variant={sortBy === "newest" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("newest")}
            >
              Edições mais recentes
            </Button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sortedGenerations.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={`Generation ${item.id}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Video overlay */}
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-2">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                {item.isVideo && item.duration && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {item.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generations;