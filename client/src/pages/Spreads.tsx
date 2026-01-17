import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/Layout";

import {
  BalanceWheelSpread,
  HeroJourneyFullSpread,
  HeroJourneySpread,
  PairSpread,
  PastPresentFutureSpread,
  SingleCardSpread,
  SpreadSelection,
  StorySpread,
  useSpreadState,
} from "./spreads/index";

interface ActiveSpreadProps {
  mode: string;
  onBack: () => void;
}

function ActiveSpread({ mode, onBack }: ActiveSpreadProps) {
  const {
    revealed,
    questionIndex,
    handleDrawAgain,
    hasData,
    isPending,
    setQuestionIndex,
  } = useSpreadState({ mode });

  const getSpreadComponent = () => {
    switch (mode) {
      case "image":
      case "word":
        return <SingleCardSpread mode={mode} />;
      case "pair":
        return <PairSpread />;
      case "past-present-future":
        return <PastPresentFutureSpread />;
      case "story":
        return <StorySpread />;
      case "hero-journey":
        return <HeroJourneySpread />;
      case "hero-journey-full":
        return <HeroJourneyFullSpread />;
      case "balance-wheel":
        return <BalanceWheelSpread mode="balance-wheel" />;
      case "balance-wheel-custom":
        return <BalanceWheelSpread mode="balance-wheel-custom" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "pair":
        return "OH 经典组合";
      case "past-present-future":
        return "时间轴牌阵 (过去/现在/未来)";
      case "story":
        return "故事接龙";
      case "hero-journey":
        return "小英雄之旅";
      case "hero-journey-full":
        return "英雄之旅（完整版）";
      case "balance-wheel":
        return "生命平衡轮";
      case "balance-wheel-custom":
        return "平衡轮（自定义）";
      default:
        return `单张${mode === "image" ? "图卡" : "字卡"}牌阵`;
    }
  };

  const getSummaryQuestions = () => {
    switch (mode) {
      case "past-present-future":
        return [
          "从过去到未来的演变中，你看到了什么样的生命脉络？",
          "为了走向理想的未来，现在的你最需要做出的调整是什么？",
          "回顾这段旅程，哪个阶段带给你的成长最为深刻？",
        ];
      case "balance-wheel":
      case "balance-wheel-custom":
        return [
          "观察这个平衡轮，哪一个领域的缺失最让你感到意外？",
          "如果你只提升其中一个领域，哪个领域的改变会带动整体的平衡？",
          "看到这个形状，你现在对自己生活的平衡感有什么新的定义？",
        ];
      case "hero-journey":
      case "hero-journey-full":
        return [
          "在这个英雄故事中，你感受到的最大力量源泉在哪里？",
          "这场冒险揭示了你潜意识中怎样的核心冲突与渴望？",
          "如果英雄现在对你说一句话，他会告诉你什么？",
        ];
      case "story":
        return [
          "这个故事的主旋律是关于什么的？（如勇气、接纳、转变等）",
          "故事中哪个转折点让你印象最深刻？它对应了你现实中的什么？",
          "如果这个故事有续集，你希望接下来的剧情如何发展？",
        ];
      case "pair":
        return [
          "图卡与字卡的碰撞，产生了一层怎样的意想不到的新含义？",
          "这个组合触动了你当下哪一个具体的决策或情感困惑？",
          "如果用一个词来概括这个组合带给你的启示，那会是什么？",
        ];
      default:
        return [
          "观察这组卡片，你整体的直觉感受是什么？",
          "这些卡片之间是否存在某种你意想不到的联系？",
          "如果这组牌是一个整体的建议，它在告诉你什么？",
          "看完这组牌，你内心最强烈的渴望或担忧是什么？",
          "为了回应这组牌带给你的启发，你打算做的第一件小事是什么？",
        ];
    }
  };

  const summaryQuestions = getSummaryQuestions();

  const getAllRevealed = () => {
    if (mode === "past-present-future") {
      return revealed[0] && revealed[1] && revealed[2];
    } else if (mode === "story") {
      return (
        revealed[0] && revealed[1] && revealed[2] && revealed[3] && revealed[4]
      );
    } else if (mode === "hero-journey") {
      return (
        revealed[0] &&
        revealed[1] &&
        revealed[2] &&
        revealed[3] &&
        revealed[4] &&
        revealed[5]
      );
    } else if (mode === "balance-wheel" || mode === "balance-wheel-custom") {
      return (
        revealed[0] &&
        revealed[1] &&
        revealed[2] &&
        revealed[3] &&
        revealed[4] &&
        revealed[5]
      );
    } else if (mode === "hero-journey-full") {
      return (
        revealed[0] &&
        revealed[1] &&
        revealed[2] &&
        revealed[3] &&
        revealed[4] &&
        revealed[5] &&
        revealed[6] &&
        revealed[7] &&
        revealed[8] &&
        revealed[9]
      );
    }
    return revealed[0];
  };

  const allRevealed = getAllRevealed();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> 返回选择
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold">{getTitle()}</h2>
        </div>
        <div className="w-24">
          {!isPending && hasData && (
            <Button
              onClick={handleDrawAgain}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" /> 重新抽取
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border-2 border-dashed border-border p-8 relative overflow-hidden">
        <div className="w-full">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-96 w-full">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-display text-xl text-muted-foreground animate-pulse">
                洗牌中...
              </p>
            </div>
          ) : (
            getSpreadComponent()
          )}
        </div>

        {!isPending && hasData && (
          <div className="mt-8 text-center space-y-2">
            {!allRevealed ? (
              <p className="text-muted-foreground animate-bounce">
                点击卡片翻牌
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={questionIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="font-hand text-2xl text-primary italic text-center"
                    >
                      {summaryQuestions[questionIndex]}
                    </motion.p>
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setQuestionIndex(
                        (prev) => (prev + 1) % summaryQuestions.length
                      );
                    }}
                    className="h-8 w-8 text-primary/60 hover:text-primary transition-colors shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function Spreads() {
  const [activeMode, setActiveMode] = useState<string | null>(null);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!activeMode ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SpreadSelection onSelect={setActiveMode} />
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ActiveSpread
              mode={activeMode}
              onBack={() => setActiveMode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
