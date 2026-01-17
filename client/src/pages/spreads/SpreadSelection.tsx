import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpreadSelectionProps {
  onSelect: (mode: string) => void;
}

export function SpreadSelection({ onSelect }: SpreadSelectionProps) {
  const [activeCountFilter, setActiveCountFilter] = useState<string | null>(
    null
  );
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);

  const options = [
    {
      id: "image",
      title: "单张图卡",
      desc: "抽取一张图卡，激发直觉、想象力与潜在的情感。",
      bg: "bg-orange-50/50 hover:bg-orange-100/50 border-orange-100 shadow-sm hover:shadow-md",
      tags: ["1-2张", "抽卡"],
    },
    {
      id: "word",
      title: "单张字卡",
      desc: "抽取一张字卡，提供一个思考的主题、概念或背景。",
      bg: "bg-blue-50/50 hover:bg-blue-100/50 border-blue-100 shadow-sm hover:shadow-md",
      tags: ["1-2张", "抽卡"],
    },
    {
      id: "pair",
      title: "OH 经典组合",
      desc: "将图卡放入字卡框中，通过两者的交互获得深度洞察。",
      bg: "bg-purple-50/50 hover:bg-purple-100/50 border-purple-100 shadow-md hover:shadow-lg ring-1 ring-purple-200",
      featured: true,
      tags: ["1-2张", "抽卡"],
    },
    {
      id: "past-present-future",
      title: "时间轴牌阵",
      desc: "抽取三张卡片，分别代表过去、现在和未来。",
      bg: "bg-teal-50/50 hover:bg-teal-100/50 border-teal-100 shadow-sm hover:shadow-md",
      tags: ["3-5张", "抽卡"],
    },
    {
      id: "story",
      title: "故事接龙",
      desc: "随机抽取五张牌，编织一段奇妙的叙事旅程。",
      bg: "bg-rose-50/50 hover:bg-rose-100/50 border-rose-100 shadow-sm hover:shadow-md",
      tags: ["3-5张", "抽卡"],
    },
    {
      id: "hero-journey",
      title: "小英雄之旅",
      desc: "六步克服卡玩法，从困境到成长，探索内在的转变之旅。",
      bg: "bg-amber-50/50 hover:bg-amber-100/50 border-amber-100 shadow-sm hover:shadow-md",
      tags: ["6张以上", "抽卡"],
    },
    {
      id: "hero-journey-full",
      title: "英雄之旅（完整版）",
      desc: "十步叙事牌阵，完整构建英雄成长史诗。",
      bg: "bg-orange-50/50 hover:bg-orange-100/50 border-orange-100 shadow-md hover:shadow-lg",
      tags: ["6张以上", "抽卡"],
    },
    {
      id: "balance-wheel",
      title: "生命平衡轮",
      desc: "探索身、心、灵、家、事、社的平衡，绘制你的生命雷达图。",
      bg: "bg-indigo-50/50 hover:bg-indigo-100/50 border-indigo-100 shadow-sm hover:shadow-md",
      tags: ["6张以上", "抽卡"],
    },
    {
      id: "balance-wheel-custom",
      title: "平衡轮（自定义）",
      desc: "自定义六个关键领域，抽牌后评估这些领域的现状并打分。",
      bg: "bg-amber-50/50 hover:bg-amber-100/50 border-amber-100 shadow-sm hover:shadow-md",
      tags: ["6张以上", "抽卡"],
    },
  ];

  const filteredOptions = options.filter((opt) => {
    const countMatch =
      !activeCountFilter || opt.tags.includes(activeCountFilter);
    const typeMatch = !activeTypeFilter || opt.tags.includes(activeTypeFilter);
    return countMatch && typeMatch;
  });

  const FilterButton = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="rounded-full px-4 h-8 text-xs transition-all duration-300"
    >
      {label}
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
            选择牌阵
          </h1>
          <p className="text-muted-foreground text-lg">
            选择你今天想要与卡片互动的方式。
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <FilterButton
            label="全部"
            active={activeCountFilter === null && activeTypeFilter === null}
            onClick={() => {
              setActiveCountFilter(null);
              setActiveTypeFilter(null);
            }}
          />
          <div className="w-px h-4 bg-border/60 self-center mx-1 hidden sm:block" />
          <FilterButton
            label="1-2张"
            active={activeCountFilter === "1-2张"}
            onClick={() =>
              setActiveCountFilter(
                activeCountFilter === "1-2张" ? null : "1-2张"
              )
            }
          />
          <FilterButton
            label="3-5张"
            active={activeCountFilter === "3-5张"}
            onClick={() =>
              setActiveCountFilter(
                activeCountFilter === "3-5张" ? null : "3-5张"
              )
            }
          />
          <FilterButton
            label="6张+"
            active={activeCountFilter === "6张以上"}
            onClick={() =>
              setActiveCountFilter(
                activeCountFilter === "6张以上" ? null : "6张以上"
              )
            }
          />
          <div className="w-px h-4 bg-border/60 self-center mx-1 hidden sm:block" />
          <FilterButton
            label="抽牌"
            active={activeTypeFilter === "抽卡"}
            onClick={() =>
              setActiveTypeFilter(activeTypeFilter === "抽卡" ? null : "抽卡")
            }
          />
          <FilterButton
            label="选牌"
            active={activeTypeFilter === "选卡"}
            onClick={() =>
              setActiveTypeFilter(activeTypeFilter === "选卡" ? null : "选卡")
            }
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "flex flex-col p-8 rounded-2xl border-2 transition-all duration-300 text-left h-full relative overflow-hidden",
              opt.bg,
              opt.featured
                ? "border-primary/20 shadow-lg ring-2 ring-primary/5 md:-mt-4 md:mb-4"
                : "border-transparent shadow-sm"
            )}
          >
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20">
              {opt.featured && (
                <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  热门选择
                </div>
              )}
              <div className="flex gap-1">
                {opt.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-white/60 backdrop-blur-sm text-primary/80 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/10"
                  >
                    {tag === "抽卡" ? "抽牌" : tag === "选卡" ? "选牌" : tag}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">
              {opt.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {opt.desc}
            </p>
            <div className="mt-auto pt-6 text-sm font-semibold text-primary uppercase tracking-wider">
              开始 &rarr;
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
