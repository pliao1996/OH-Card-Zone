import { PairDisplay } from '@/components/CardDisplay';
import { Card } from '@shared/schema';

import { useSpreadState } from './useSpreadsState';

interface PairSpreadProps {
  currentCards?: Card[];
  revealed?: Record<number, boolean>;
  toggleReveal?: (index: number) => void;
}

export function PairSpread(props?: PairSpreadProps) {
  const hookState = useSpreadState({
    mode: "pair",
  });

  const currentCards = props?.currentCards ?? hookState.currentCards;
  const revealed = props?.revealed ?? hookState.revealed;
  const toggleReveal = props?.toggleReveal ?? hookState.toggleReveal;

  const img = currentCards.find((c) => c.type === "image");
  const word = currentCards.find((c) => c.type === "word");

  if (!img || !word) {
    return null;
  }

  return (
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
