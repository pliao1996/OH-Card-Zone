import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';

import { CardDisplay } from '@/components/CardDisplay';
import { Card } from '@shared/schema';

import { useSpreadState } from './useSpreadsState';

interface PositiveNegativeSpreadProps {
  currentCards?: Card[];
  revealed?: Record<number, boolean>;
  toggleReveal?: (index: number) => void;
}

export function PositiveNegativeSpread(props?: PositiveNegativeSpreadProps) {
  const hookState = useSpreadState({
    mode: "positive-negative",
  });

  const currentCards = props?.currentCards ?? hookState.currentCards;
  const revealed = props?.revealed ?? hookState.revealed;
  const toggleReveal = props?.toggleReveal ?? hookState.toggleReveal;

  const [swapped, setSwapped] = useState(false);

  if (currentCards.length < 2) {
    return null;
  }

  // Get the cards - if swapped, reverse their positions
  const positiveCard = swapped ? currentCards[1] : currentCards[0];
  const negativeCard = swapped ? currentCards[0] : currentCards[1];

  const handleSwap = () => {
    setSwapped(!swapped);
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 gap-8">
      <div className="flex flex-row items-center justify-center gap-8">
        {/* Positive Card */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-semibold text-green-600 tracking-wide uppercase">
            正面
          </div>
          <div
            className="cursor-pointer"
            onClick={() => toggleReveal(swapped ? 1 : 0)}
          >
            <CardDisplay
              card={positiveCard}
              isRevealed={revealed[swapped ? 1 : 0] || false}
            />
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 border border-primary/20"
          title="对换两张牌的位置"
        >
          <ArrowRightLeft size={18} />
          <span className="text-xs font-medium">对换</span>
        </button>

        {/* Negative Card */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-semibold text-red-600 tracking-wide uppercase">
            负面
          </div>
          <div
            className="cursor-pointer"
            onClick={() => toggleReveal(swapped ? 0 : 1)}
          >
            <CardDisplay
              card={negativeCard}
              isRevealed={revealed[swapped ? 0 : 1] || false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
