import { useEffect, useState } from 'react';

import { useDrawCards } from '@/hooks/use-cards';
import { Card } from '@shared/schema';

export interface UseSpreadStateProps {
  mode: string;
}

export interface UseSpreadStateReturn {
  currentCards: Card[];
  revealed: Record<number, boolean>;
  questionIndex: number;
  setRevealed: (revealed: Record<number, boolean>) => void;
  setQuestionIndex: (index: number) => void;
  toggleReveal: (index: number) => void;
  handleDrawAgain: () => void;
  handleNextQuestion: () => void;
  hasData: boolean;
  isPending: boolean;
  data: any;
}

export function useSpreadState({
  mode,
}: UseSpreadStateProps): UseSpreadStateReturn {
  const { mutate: draw, data, isPending } = useDrawCards();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [isRedrawing, setIsRedrawing] = useState(false);

  // Synchronize currentCards when data arrives and cards are hidden
  useEffect(() => {
    if (
      data?.cards &&
      Object.values(revealed).every((v) => !v) &&
      !isRedrawing
    ) {
      setCurrentCards(data.cards);
    }
  }, [data, revealed, isRedrawing]);

  // Determine required card count based on mode
  const getCardCount = (): number => {
    if (mode === "hero-journey-full") return 10;
    if (
      mode === "hero-journey" ||
      mode === "balance-wheel" ||
      mode === "balance-wheel-custom"
    )
      return 6;
    if (mode === "story") return 5;
    if (mode === "past-present-future") return 3;
    if (mode === "ho-oponopono") return 4;
    return 1;
  };

  const cardCount = getCardCount();
  const hasData = currentCards.length >= cardCount;

  // Initial draw on mount
  useEffect(() => {
    if (mode === "past-present-future") {
      draw({ mode: "image", count: 3 } as any);
    } else if (mode === "story") {
      draw({ mode: "image", count: 5 } as any);
    } else if (mode === "hero-journey") {
      draw({ mode: "image", count: 6 } as any);
    } else if (mode === "hero-journey-full") {
      draw({ mode: "image", count: 10 } as any);
    } else if (mode === "balance-wheel" || mode === "balance-wheel-custom") {
      draw({ mode: "image", count: 6 } as any);
    } else if (mode === "ho-oponopono") {
      draw({ mode: "image", count: 4 } as any);
    } else if (mode === "pair") {
      draw({ mode: "pair" } as any);
    } else {
      draw({ mode: mode as any });
    }
  }, [mode, draw]);

  const handleDrawAgain = () => {
    setIsRedrawing(true);
    setRevealed({});

    const drawMode =
      mode === "past-present-future" ||
      mode === "story" ||
      mode.startsWith("hero-journey") ||
      mode === "balance-wheel" ||
      mode === "balance-wheel-custom" ||
      mode === "ho-oponopono"
        ? "image"
        : mode;

    const count =
      mode === "hero-journey-full"
        ? 10
        : mode === "hero-journey" ||
            mode === "balance-wheel" ||
            mode === "balance-wheel-custom"
          ? 6
          : mode === "story"
            ? 5
            : mode === "past-present-future"
              ? 3
              : mode === "ho-oponopono"
                ? 4
                : 1;

    draw({ mode: drawMode as any, count });

    // Keep cards face-down until new cards are fully loaded
    setTimeout(() => {
      setIsRedrawing(false);
    }, 1000);
  };

  const toggleReveal = (index: number) => {
    if (data?.cards) {
      setCurrentCards(data.cards);
      setRevealed((prev) => ({ ...prev, [index]: true }));
    }
  };

  const handleNextQuestion = () => {
    // This will be overridden in parent components with proper question count
    setQuestionIndex((prev) => prev + 1);
  };

  return {
    currentCards,
    revealed,
    questionIndex,
    setRevealed,
    setQuestionIndex,
    toggleReveal,
    handleDrawAgain,
    handleNextQuestion,
    hasData,
    isPending,
    data,
  };
}
