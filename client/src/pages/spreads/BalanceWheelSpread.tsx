import { useState } from 'react';
import {
    PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer
} from 'recharts';

import { CardDisplay } from '@/components/CardDisplay';

import { useSpreadState } from './useSpreadsState';

interface BalanceWheelSpreadProps {
  mode?: "balance-wheel" | "balance-wheel-custom";
}

export function BalanceWheelSpread({
  mode = "balance-wheel",
}: BalanceWheelSpreadProps) {
  const { currentCards, revealed, toggleReveal } = useSpreadState({
    mode,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [scoredIndices, setScoredIndices] = useState<Set<number>>(new Set());
  const [customKeywords, setCustomKeywords] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const defaultLabels = ["身", "心", "灵", "家", "事", "社"];
  const labels =
    mode === "balance-wheel-custom" ? customKeywords : defaultLabels;

  const radarData = labels.map((label, i) => ({
    subject: label || `关键词 ${i + 1}`,
    A: scoredIndices.has(i) ? scores[i] : 0,
    fullMark: 10,
  }));

  const allScored = scoredIndices.size === 6;

  return (
    <div className="w-full py-8 flex flex-col items-center gap-8">
      <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
        {/* Radar Chart in Center */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="40%"
              data={radarData}
              style={{ cursor: "pointer" }}
              onClick={(e: any) => {
                if (e && e.activeCoordinate) {
                  const { x, y } = e.activeCoordinate;

                  const cx = 225;
                  const cy = 225;
                  const outerRadius = 180;

                  const dx = x - cx;
                  const dy = y - cy;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const val = Math.round(
                    Math.min(10, Math.max(0, (dist / outerRadius) * 20))
                  );

                  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                  angle = (angle + 90 + 360) % 360;
                  const idx = Math.round((angle / 60) % 6);

                  if (revealed[idx]) {
                    const newScores = [...scores];
                    newScores[idx] = val;
                    setScores(newScores);
                    setScoredIndices((prev) => new Set(prev).add(idx));
                  }
                }
              }}
            >
              <PolarGrid stroke="hsl(var(--primary) / 0.2)" gridType="circle" />
              <PolarRadiusAxis
                domain={[0, 10]}
                tickCount={11}
                tick={false}
                axisLine={false}
              />
              <PolarAngleAxis dataKey="subject" tick={false} />
              <Radar
                name="Balance"
                dataKey="A"
                stroke={allScored ? "hsl(var(--primary))" : "transparent"}
                fill="hsl(var(--primary))"
                fillOpacity={allScored ? 0.4 : 0}
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  if (!scoredIndices.has(index)) return <g key={index} />;

                  const score = scores[index];
                  let dotColor = "hsl(0, 100%, 50%)"; // 默认红色 (< 5)
                  if (score >= 7) {
                    dotColor = "hsl(120, 100%, 40%)"; // 绿色 (>= 7)
                  } else if (score >= 5) {
                    dotColor = "hsl(45, 100%, 50%)"; // 黄色 (5-6)
                  }

                  return (
                    <circle
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={dotColor}
                      style={{ cursor: "pointer", pointerEvents: "all" }}
                    />
                  );
                }}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Cards in Circle */}
        <div className="relative w-full h-full z-10 pointer-events-none">
          {currentCards.slice(0, 6).map((card, idx) => {
            const angle = (idx * 60 - 90) * (Math.PI / 180);
            // 增加水平半径，减少纵向半径避免上下遮挡
            const horizontalRadius = 55;
            const verticalRadius = 42;

            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // 对于上下位置（索引0和3）使用较小的纵向半径，其他使用水平半径
            const radius =
              Math.abs(sin) > 0.7 ? verticalRadius : horizontalRadius;

            const x = 50 + radius * cos;
            const y = 50 + radius * sin;

            // 标签显示在雷达图最外圈，轴线顶端
            // 雷达图 outerRadius="40%"，所以标签半径设为 40
            const labelRadius = Math.abs(sin) > 0.7 ? 22 : 25;
            const labelX = 50 + labelRadius * Math.cos(angle);
            const labelY = 50 + labelRadius * Math.sin(angle);

            return (
              <div key={idx} className="contents">
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-auto"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <CardDisplay
                    card={card}
                    size="sm"
                    isRevealed={revealed[idx] || false}
                    onClick={() => toggleReveal(idx)}
                  />
                </div>

                {/* Inline Editable Label */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                  style={{ left: `${labelX}%`, top: `${labelY}%` }}
                >
                  {editingIndex === idx ? (
                    <input
                      autoFocus
                      type="text"
                      value={labels[idx]}
                      className="w-16 text-center text-sm font-bold bg-transparent border-none outline-none text-primary"
                      onChange={(e) => {
                        const newKeywords = [...customKeywords];
                        newKeywords[idx] = e.target.value.slice(0, 4);
                        setCustomKeywords(newKeywords);
                      }}
                      onBlur={() => setEditingIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingIndex(null);
                      }}
                    />
                  ) : (
                    <span
                      className="text-sm font-bold text-primary cursor-text select-none min-w-[2rem] inline-block text-center"
                      onDoubleClick={() => {
                        setEditingIndex(idx);
                      }}
                    >
                      {labels[idx] ||
                        (mode === "balance-wheel-custom"
                          ? `关键词`
                          : defaultLabels[idx])}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
