import { useState } from "react";
import { Layout } from "@/components/ui/Layout";
import { useCards } from "@/hooks/use-cards";
import { CardDisplay } from "@/components/CardDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type Card } from "@shared/schema";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Gallery() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: imageCards, isLoading: loadingImages } = useCards("image");
  const { data: wordCards, isLoading: loadingWords } = useCards("word");

  const filterCards = (cards: Card[] | undefined) => {
    if (!cards) return [];
    if (!searchTerm) return cards;
    return cards.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-primary">Card Gallery</h1>
            <p className="text-muted-foreground mt-2">Browse the complete collection of OH cards.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search cards..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="mb-8 p-1 bg-secondary/50 border border-border/50 rounded-xl">
            <TabsTrigger value="image" className="rounded-lg px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Image Cards ({imageCards?.length || 0})</TabsTrigger>
            <TabsTrigger value="word" className="rounded-lg px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Word Cards ({wordCards?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-0">
             {loadingImages ? (
               <GallerySkeleton />
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {filterCards(imageCards).map((card) => (
                   <CardDisplay 
                     key={card.id} 
                     card={card} 
                     className="w-full h-auto aspect-[3/4]"
                     onClick={() => setSelectedCard(card)}
                   />
                 ))}
                 {filterCards(imageCards).length === 0 && (
                   <div className="col-span-full py-12 text-center text-muted-foreground">No image cards found.</div>
                 )}
               </div>
             )}
          </TabsContent>

          <TabsContent value="word" className="mt-0">
            {loadingWords ? (
               <GallerySkeleton />
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {filterCards(wordCards).map((card) => (
                   <CardDisplay 
                     key={card.id} 
                     card={card} 
                     className="w-full h-auto aspect-[3/4]"
                     onClick={() => setSelectedCard(card)}
                   />
                 ))}
                 {filterCards(wordCards).length === 0 && (
                   <div className="col-span-full py-12 text-center text-muted-foreground">No word cards found.</div>
                 )}
               </div>
             )}
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
            {selectedCard && (
               <div 
                  className="relative cursor-pointer" 
                  onClick={() => setSelectedCard(null)}
               >
                 <CardDisplay 
                    card={selectedCard} 
                    size="lg" 
                    className="scale-125 md:scale-150 transition-transform" 
                  />
               </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-[3/4] rounded-xl" />
      ))}
    </div>
  );
}
