import { CardDisplay } from '@/components/CardDisplay';
import { Card } from '@shared/schema';

import { useSpreadState } from './useSpreadsState';

interface SingleCardSpreadProps {
  mode: "image" | "word";
  currentCards?: Card[];
  revealed?: Record<number, boolean>;
  toggleReveal?: (index: number) => void;
}

export function SingleCardSpread({
  mode,
  currentCards: propCurrentCards,
  revealed: propRevealed,
  toggleReveal: propToggleReveal,
}: SingleCardSpreadProps) {
  const hookState = useSpreadState({ mode });

  const currentCards = propCurrentCards ?? hookState.currentCards;
  const revealed = propRevealed ?? hookState.revealed;
  const toggleReveal = propToggleReveal ?? hookState.toggleReveal;

  const card = currentCards[0];

  if (!card) {
    return null;
  }

  return (
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
