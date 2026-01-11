import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/ui/Layout";
import { useDrawCards } from "@/hooks/use-cards";
import { CardDisplay, PairDisplay } from "@/components/CardDisplay";
import { Button } from "@/components/ui/button";
import { type Card } from "@shared/schema";
import { Loader2, RotateCcw, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Sub-component: Spread Selection ---
function SpreadSelection({ onSelect }: { onSelect: (mode: 'image' | 'word' | 'pair') => void }) {
  const options = [
    { 
      id: 'image', 
      title: 'Single Image', 
      desc: 'Draw one image card to prompt a feeling or memory.',
      bg: 'bg-orange-50 hover:bg-orange-100 border-orange-100'
    },
    { 
      id: 'word', 
      title: 'Single Word', 
      desc: 'Draw one word card to provide a theme or context.',
      bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100'
    },
    { 
      id: 'pair', 
      title: 'The OH Pair', 
      desc: 'Combine an image and a word for deep insight.',
      bg: 'bg-purple-50 hover:bg-purple-100 border-purple-100',
      featured: true
    },
  ];

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">Choose a Spread</h1>
        <p className="text-muted-foreground text-lg">Select how you want to interact with the cards today.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id as any)}
            className={cn(
              "flex flex-col p-8 rounded-2xl border-2 transition-all duration-300 text-left h-full relative overflow-hidden",
              opt.bg,
              opt.featured ? "border-primary/20 shadow-lg ring-2 ring-primary/5 md:-mt-4 md:mb-4" : "border-transparent shadow-sm"
            )}
          >
            {opt.featured && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">{opt.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{opt.desc}</p>
            <div className="mt-auto pt-6 text-sm font-semibold text-primary uppercase tracking-wider">
              Start &rarr;
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Sub-component: Active Spread ---
function ActiveSpread({ 
  mode, 
  onBack, 
  onDrawAgain 
}: { 
  mode: 'image' | 'word' | 'pair'; 
  onBack: () => void;
  onDrawAgain: () => void; // Triggered to reset state
}) {
  const { mutate: draw, data, isPending, reset } = useDrawCards();
  const [revealed, setRevealed] = useState(false);

  // Initial draw on mount
  useState(() => {
    draw({ mode });
  });

  const handleDrawAgain = () => {
    setRevealed(false);
    // Slight delay to allow flip back animation if desired, or just reset immediately
    setTimeout(() => {
      reset();
      draw({ mode });
    }, 300);
  };

  const hasData = data && data.cards && data.cards.length > 0;
  
  // Prepare cards based on mode
  let displayContent;
  
  if (isPending || !hasData) {
    displayContent = (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-display text-xl text-muted-foreground animate-pulse">Shuffling deck...</p>
      </div>
    );
  } else if (mode === 'pair') {
    // For pair, we expect 2 cards: [Image, Word] (backend logic handles this)
    // We assume backend returns [ImageCard, WordCard] or similar. 
    // Let's robustly find them.
    const img = data.cards.find(c => c.type === 'image');
    const word = data.cards.find(c => c.type === 'word');

    if (img && word) {
      displayContent = (
         <div className="flex justify-center items-center py-12">
           <PairDisplay 
             imageCard={img} 
             wordCard={word} 
             isRevealed={revealed} 
             onClick={() => setRevealed(true)} 
           />
         </div>
      );
    }
  } else {
    // Single card modes
    const card = data.cards[0];
    displayContent = (
      <div className="flex justify-center items-center py-12">
        <CardDisplay 
          card={card} 
          size="lg" 
          isRevealed={revealed} 
          onClick={() => setRevealed(true)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Selection
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold capitalize">
            {mode === 'pair' ? 'OH Pair Spread' : `Single ${mode} Card`}
          </h2>
        </div>
        <div className="w-24" /> {/* Spacer for balance */}
      </div>

      {/* Main Card Area */}
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={isPending ? 'loading' : 'content'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {displayContent}
          </motion.div>
        </AnimatePresence>
        
        {!isPending && hasData && (
          <div className="mt-8 text-center space-y-2">
            {!revealed ? (
              <p className="text-muted-foreground animate-bounce">Click card to reveal</p>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="font-hand text-2xl text-primary max-w-md mx-auto">
                  "What does this evoke in you right now?"
                </p>
                <Button onClick={handleDrawAgain} size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <RotateCcw className="w-4 h-4" /> Draw Again
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function Spreads() {
  const [activeMode, setActiveMode] = useState<'image' | 'word' | 'pair' | null>(null);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!activeMode ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SpreadSelection onSelect={setActiveMode} />
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ActiveSpread 
              mode={activeMode} 
              onBack={() => setActiveMode(null)} 
              onDrawAgain={() => {/* Handled inside component */}}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
