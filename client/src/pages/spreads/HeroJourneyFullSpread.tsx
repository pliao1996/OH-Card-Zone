import { CardDisplay } from "@/components/CardDisplay";
import { cn } from "@/lib/utils";

import { useSpreadState } from "./useSpreadsState";

export function HeroJourneyFullSpread() {
  const { currentCards, revealed, toggleReveal } = useSpreadState({
    mode: "hero-journey-full",
  });

  const labels = [
    "英雄",
    "故事发生的地方",
    "英雄的技能",
    "英雄的使命",
    "英雄得到的宝物",
    "出现的魔王",
    "魔王的技能",
    "英雄与魔王的战斗",
    "战斗的结果",
    "回到平凡回首往事",
  ];

  const cards = currentCards.slice(0, 10);

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
