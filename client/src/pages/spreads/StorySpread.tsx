import { CardDisplay } from "@/components/CardDisplay";
import { cn } from "@/lib/utils";

import { useSpreadState } from "./useSpreadsState";

export function StorySpread() {
  const { currentCards, revealed, toggleReveal } = useSpreadState({
    mode: "story",
  });

  const labels = ["一", "二", "三", "四", "五"];
  const cards = currentCards.slice(0, 5);

  return (
    <div className={cn("grid gap-6 w-full py-8", "grid-cols-2 md:grid-cols-5")}>
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
  );
}
