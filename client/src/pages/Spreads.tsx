import { useState, useEffect } from "react";
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
function SpreadSelection({ onSelect }: { onSelect: (mode: 'image' | 'word' | 'pair' | 'story' | 'past-present-future') => void }) {
  const [activeCountFilter, setActiveCountFilter] = useState<string | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);

  const options = [
    { 
      id: 'image', 
      title: '单张图卡', 
      desc: '抽取一张图卡，激发直觉、想象力与潜在的情感。',
      bg: 'bg-orange-50/50 hover:bg-orange-100/50 border-orange-100 shadow-sm hover:shadow-md',
      tags: ['1-2张', '抽卡']
    },
    { 
      id: 'word', 
      title: '单张字卡', 
      desc: '抽取一张字卡，提供一个思考的主题、概念或背景。',
      bg: 'bg-blue-50/50 hover:bg-blue-100/50 border-blue-100 shadow-sm hover:shadow-md',
      tags: ['1-2张', '抽卡']
    },
    { 
      id: 'pair', 
      title: 'OH 经典组合', 
      desc: '将图卡放入字卡框中，通过两者的交互获得深度洞察。',
      bg: 'bg-purple-50/50 hover:bg-purple-100/50 border-purple-100 shadow-md hover:shadow-lg ring-1 ring-purple-200',
      featured: true,
      tags: ['1-2张', '抽卡']
    },
    {
      id: 'past-present-future',
      title: '时间轴牌阵',
      desc: '抽取三张卡片，分别代表过去、现在和未来。',
      bg: 'bg-teal-50/50 hover:bg-teal-100/50 border-teal-100 shadow-sm hover:shadow-md',
      tags: ['3-5张', '抽卡']
    },
    {
      id: 'story',
      title: '故事接龙',
      desc: '随机抽取五张牌，编织一段奇妙的叙事旅程。',
      bg: 'bg-rose-50/50 hover:bg-rose-100/50 border-rose-100 shadow-sm hover:shadow-md',
      tags: ['3-5张', '抽卡']
    }
  ];

  const filteredOptions = options.filter(opt => {
    const countMatch = !activeCountFilter || opt.tags.includes(activeCountFilter);
    const typeMatch = !activeTypeFilter || opt.tags.includes(activeTypeFilter);
    return countMatch && typeMatch;
  });

  const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <Button 
      variant={active ? "default" : "outline"} 
      size="sm" 
      onClick={onClick}
      className="rounded-full px-4 h-8 text-xs transition-all duration-300"
    >
      {label}
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">选择牌阵</h1>
          <p className="text-muted-foreground text-lg">选择你今天想要与卡片互动的方式。</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <FilterButton label="全部" active={activeCountFilter === null && activeTypeFilter === null} onClick={() => { setActiveCountFilter(null); setActiveTypeFilter(null); }} />
          <div className="w-px h-4 bg-border/60 self-center mx-1 hidden sm:block" />
          <FilterButton label="1-2张" active={activeCountFilter === '1-2张'} onClick={() => setActiveCountFilter(activeCountFilter === '1-2张' ? null : '1-2张')} />
          <FilterButton label="3-5张" active={activeCountFilter === '3-5张'} onClick={() => setActiveCountFilter(activeCountFilter === '3-5张' ? null : '3-5张')} />
          <div className="w-px h-4 bg-border/60 self-center mx-1 hidden sm:block" />
          <FilterButton label="抽牌" active={activeTypeFilter === '抽卡'} onClick={() => setActiveTypeFilter(activeTypeFilter === '抽卡' ? null : '抽卡')} />
          <FilterButton label="选牌" active={activeTypeFilter === '选卡'} onClick={() => setActiveTypeFilter(activeTypeFilter === '选卡' ? null : '选卡')} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id as any)}
            className={cn(
              "flex flex-col p-8 rounded-2xl border-2 transition-all duration-300 text-left h-full relative overflow-hidden",
              opt.bg,
              opt.featured ? "border-primary/20 shadow-lg ring-2 ring-primary/5 md:-mt-4 md:mb-4" : "border-transparent shadow-sm"
            )}
          >
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20">
              {opt.featured && (
                <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  热门选择
                </div>
              )}
              <div className="flex gap-1">
                {opt.tags.map(tag => (
                  <div key={tag} className="bg-white/60 backdrop-blur-sm text-primary/80 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/10">
                    {tag === '抽卡' ? '抽牌' : tag === '选卡' ? '选牌' : tag}
                  </div>
                ))}
              </div>
            </div>
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState<Card[]>([]);

  // Update currentCards only when data changes AND we are NOT in the middle of a flip-back
  useState(() => {
    if (data?.cards) {
      // If we are showing back, don't update currentCards yet
      // This is the key: we hold onto the OLD cards until the user flips again
      if (Object.values(revealed).some(v => v)) {
        setCurrentCards(data.cards);
      }
    }
  });

  // Synchronize currentCards when data arrives and cards are hidden
  useEffect(() => {
    if (data?.cards && Object.values(revealed).every(v => !v)) {
      // If all are hidden, we can safely update the visible data
      setCurrentCards(data.cards);
    }
  }, [data, revealed]);

  const questions = mode === 'story' ? ["“这是一个什么样的故事？”"] : [
    "“这触动了你内心深处的什么？”",
    "“这张卡片让你想到了生活中的哪个人或哪件事？”",
    "“如果这张卡片会说话，它会对你说什么？”",
    "“这张卡片描述了你现在的什么状态？”",
    "“看着这张卡片，你的身体有什么感觉？”"
  ];

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  // Initial draw on mount
  useState(() => {
    if (mode === 'past-present-future') {
      // Need 3 cards
      draw({ mode: 'image', count: 3 } as any);
    } else if (mode === 'story') {
      // Need 5 cards
      draw({ mode: 'image', count: 5 } as any);
    } else if (mode === 'pair') {
      // Pair mode needs both image and word
      draw({ mode: 'pair' } as any);
    } else {
      draw({ mode: mode as any });
    }
  });

  const handleDrawAgain = () => {
    // 1. Immediately flip to back
    setRevealed({});
    
    // 2. Wait for flip animation to complete (approx 300-400ms) 
    // before triggering the draw mutation which would update 'data'
    setTimeout(() => {
      draw({ 
        mode: (mode === 'past-present-future' || mode === 'story' ? 'image' : mode) as any, 
        count: mode === 'story' ? 5 : (mode === 'past-present-future' ? 3 : 1)
      });
    }, 400); 
  };

  const toggleReveal = (index: number) => {
    if (data?.cards) {
      // Swapping happens HERE, exactly when user clicks to reveal
      setCurrentCards(data.cards);
      setRevealed(prev => ({ ...prev, [index]: true }));
    }
  };

  const hasData = currentCards.length >= (mode === 'story' ? 5 : (mode === 'past-present-future' ? 3 : 1));
  
  // Prepare cards based on mode
  let displayContent;
  
  if (currentCards.length === 0) {
    displayContent = (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-display text-xl text-muted-foreground animate-pulse">洗牌中...</p>
      </div>
    );
  } else if (mode === 'pair') {
    const img = currentCards.find(c => c.type === 'image');
    const word = currentCards.find(c => c.type === 'word');

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
  } else if (mode === 'past-present-future' || mode === 'story') {
    const labels = mode === 'past-present-future' ? ['过去', '现在', '未来'] : ['一', '二', '三', '四', '五'];
    const count = mode === 'story' ? 5 : 3;
    const cards = currentCards.slice(0, count);
    displayContent = (
      <div className={cn(
        "grid gap-6 w-full py-8",
        mode === 'story' ? "grid-cols-2 md:grid-cols-5" : "grid-cols-1 md:grid-cols-3"
      )}>
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
    const card = currentCards[0];
    if (card) {
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
  }

  const allRevealed = mode === 'past-present-future' 
    ? (revealed[0] && revealed[1] && revealed[2])
    : mode === 'story'
    ? (revealed[0] && revealed[1] && revealed[2] && revealed[3] && revealed[4])
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
             mode === 'story' ? '故事接龙' :
             `单张${mode === 'image' ? '图卡' : '字卡'}牌阵`}
          </h2>
        </div>
        <div className="w-24">
          {!isPending && hasData && (
            <Button onClick={handleDrawAgain} variant="outline" size="sm" className="gap-2">
              <RotateCcw className="w-4 h-4" /> 重新抽取
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border-2 border-dashed border-border p-8 relative overflow-hidden">
        <div className="w-full">
          {displayContent}
        </div>
        
        {!isPending && hasData && (
          <div className="mt-8 text-center space-y-2">
            {!allRevealed ? (
              <p className="text-muted-foreground animate-bounce">点击卡片翻牌</p>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={questionIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="font-hand text-2xl text-primary italic"
                    >
                      {questions[questionIndex]}
                    </motion.p>
                  </AnimatePresence>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNextQuestion}
                    className="h-8 w-8 text-primary/60 hover:text-primary transition-colors shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
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
