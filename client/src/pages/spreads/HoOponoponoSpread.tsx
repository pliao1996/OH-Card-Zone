import { CardDisplay } from '@/components/CardDisplay';
import { cn } from '@/lib/utils';
import { Card } from '@shared/schema';

import { useSpreadState } from './useSpreadsState';

interface HoOponoponoSpreadProps {
  currentCards?: Card[];
  revealed?: Record<number, boolean>;
  toggleReveal?: (index: number) => void;
}

export function HoOponoponoSpread(props?: HoOponoponoSpreadProps) {
  const hookState = useSpreadState({
    mode: "ho-oponopono",
  });

  const { currentCards, revealed, toggleReveal } = {
    currentCards: props?.currentCards ?? hookState.currentCards,
    revealed: props?.revealed ?? hookState.revealed,
    toggleReveal: props?.toggleReveal ?? hookState.toggleReveal,
  };

  const labels = ["对不起", "请原谅我", "谢谢你", "我爱你"];
  const cards = currentCards.slice(0, 4);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div
        className={cn(
          "grid gap-6 w-full py-8",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {cards.map((card, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-3">
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-primary uppercase tracking-widest">
                {labels[idx]}
              </span>
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
    </div>
  );
}
