import { PairDisplay } from "@/components/CardDisplay";

import { useSpreadState } from "./useSpreadsState";

export function PairSpread() {
  const { currentCards, revealed, toggleReveal } = useSpreadState({
    mode: "pair",
  });

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
