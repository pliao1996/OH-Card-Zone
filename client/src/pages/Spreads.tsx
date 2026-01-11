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
      title: '单张图卡', 
      desc: '抽取一张图卡，激发直觉、想象力与潜在的情感。',
      bg: 'bg-orange-50/50 hover:bg-orange-100/50 border-orange-100 shadow-sm hover:shadow-md'
    },
    { 
      id: 'word', 
      title: '单张字卡', 
      desc: '抽取一张字卡，提供一个思考的主题、概念或背景。',
      bg: 'bg-blue-50/50 hover:bg-blue-100/50 border-blue-100 shadow-sm hover:shadow-md'
    },
    { 
      id: 'pair', 
      title: 'OH 经典组合', 
      desc: '将图卡放入字卡框中，通过两者的交互获得深度洞察。',
      bg: 'bg-purple-50/50 hover:bg-purple-100/50 border-purple-100 shadow-md hover:shadow-lg ring-1 ring-purple-200',
      featured: true
    },
    {
      id: 'past-present-future',
      title: '时间轴牌阵',
      desc: '抽取三张卡片，分别代表过去、现在和未来。',
      bg: 'bg-teal-50/50 hover:bg-teal-100/50 border-teal-100 shadow-sm hover:shadow-md'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">选择牌阵</h1>
        <p className="text-muted-foreground text-lg">选择你今天想要与卡片互动的方式。</p>
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
                热门选择
              </div>
            )}
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">{opt.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{opt.desc}</p>
            <div className="mt-auto pt-6 text-sm font-semibold text-primary uppercase tracking-wider">
              开始 &rarr;
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
  mode: string; 
  onBack: () => void;
  onDrawAgain: () => void; 
}) {
  const { mutate: draw, data, isPending, reset } = useDrawCards();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  // Initial draw on mount
  useState(() => {
    if (mode === 'past-present-future') {
      // Need 3 cards
      draw({ mode: 'image', count: 3 } as any);
    } else {
      draw({ mode: mode as any });
    }
  });

  const handleDrawAgain = () => {
    setRevealed({});
    setTimeout(() => {
      reset();
      if (mode === 'past-present-future') {
        draw({ mode: 'image', count: 3 } as any);
      } else {
        draw({ mode: mode as any });
      }
    }, 300);
  };

  const toggleReveal = (index: number) => {
    setRevealed(prev => ({ ...prev, [index]: true }));
  };

  const hasData = data && data.cards && data.cards.length >= (mode === 'past-present-future' ? 3 : 1);
  
  // Prepare cards based on mode
  let displayContent;
  
  if (isPending || !hasData) {
    displayContent = (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-display text-xl text-muted-foreground animate-pulse">洗牌中...</p>
      </div>
    );
  } else if (mode === 'pair') {
    const img = data.cards.find(c => c.type === 'image');
    const word = data.cards.find(c => c.type === 'word');

    if (img && word) {
      displayContent = (
         <div className="flex justify-center items-center py-12">
           <PairDisplay 
             imageCard={img} 
             wordCard={word} 
             isRevealed={revealed[0] || false} 
             onClick={() => toggleReveal(0)} 
           />
         </div>
      );
    }
  } else if (mode === 'past-present-future') {
    const labels = ['过去', '现在', '未来'];
    const cards = data.cards.slice(0, 3);
    displayContent = (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full py-8">
        {cards.map((card, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{labels[idx]}</span>
            <CardDisplay 
              card={card} 
              size="sm" 
              isRevealed={revealed[idx] || false} 
              onClick={() => toggleReveal(idx)} 
            />
          </div>
        ))}
      </div>
    );
  } else {
    const card = data.cards[0];
    displayContent = (
      <div className="flex justify-center items-center py-12">
        <CardDisplay 
          card={card} 
          size="lg" 
          isRevealed={revealed[0] || false} 
          onClick={() => toggleReveal(0)} 
        />
      </div>
    );
  }

  const allRevealed = mode === 'past-present-future' 
    ? (revealed[0] && revealed[1] && revealed[2])
    : revealed[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> 返回选择
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold">
            {mode === 'pair' ? 'OH 经典组合' : 
             mode === 'past-present-future' ? '时间轴牌阵 (过去/现在/未来)' :
             `单张${mode === 'image' ? '图卡' : '字卡'}牌阵`}
          </h2>
        </div>
        <div className="w-24" />
      </div>

      <div className="min-h-[500px] flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border-2 border-dashed border-border p-8 relative overflow-hidden">
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
            {!allRevealed ? (
              <p className="text-muted-foreground animate-bounce">点击卡片翻牌</p>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <p className="font-hand text-2xl text-primary max-w-md mx-auto">
                  “这触动了你内心深处的什么？”
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleDrawAgain} size="lg" variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> 重新抽取
                  </Button>
                </div>
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
  const [activeMode, setActiveMode] = useState<string | null>(null);

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
