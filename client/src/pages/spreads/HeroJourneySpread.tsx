import { CardDisplay } from '@/components/CardDisplay';
import { cn } from '@/lib/utils';
import { Card } from '@shared/schema';

import { useSpreadState } from './useSpreadsState';

interface HeroJourneySpreadProps {
  currentCards?: Card[];
  revealed?: Record<number, boolean>;
  toggleReveal?: (index: number) => void;
}

export function HeroJourneySpread(props?: HeroJourneySpreadProps) {
  const hookState = useSpreadState({
    mode: "hero-journey",
  });

  const currentCards = props?.currentCards ?? hookState.currentCards;
  const revealed = props?.revealed ?? hookState.revealed;
  const toggleReveal = props?.toggleReveal ?? hookState.toggleReveal;

  const labels = ["困境卡", "根源卡", "资源卡", "行动卡", "成长卡", "守护卡"];
  const journeyQuestions = [
    "明确英雄的起点，即当下的核心困境。",
    "探索困境背后的内在阻碍。",
    "寻找可调用的内在或外在资源。",
    "找到突破困境的关键行动。",
    "预见突破困境后英雄的状态。",
    "确定应对践行过程中可能出现阻碍的方法。",
  ];

  const cards = currentCards.slice(0, 6);

  return (
    <div className={cn("grid gap-6 w-full py-8", "grid-cols-2 md:grid-cols-3")}>
      {cards.map((card, idx) => (
        <div key={idx} className="flex flex-col items-center space-y-3">
          <div className="text-center space-y-1">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">
              {labels[idx]}
            </span>
            <p className="text-[10px] leading-tight text-muted-foreground max-w-[120px] mx-auto opacity-80">
              {journeyQuestions[idx]}
            </p>
          </div>
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
}
