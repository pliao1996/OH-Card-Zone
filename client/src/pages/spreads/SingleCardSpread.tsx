import { CardDisplay } from "@/components/CardDisplay";

import { useSpreadState } from "./useSpreadsState";

interface SingleCardSpreadProps {
  mode: "image" | "word";
}

export function SingleCardSpread({ mode }: SingleCardSpreadProps) {
  const { currentCards, revealed, toggleReveal } = useSpreadState({ mode });

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
