import { motion, AnimatePresence } from "framer-motion";
import { type Card } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardDisplayProps {
  card: Card;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CardDisplay({ 
  card, 
  isRevealed = true, 
  onClick, 
  className,
  size = 'md' 
}: CardDisplayProps) {
  
  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-64",
    lg: "w-64 h-80 sm:w-72 sm:h-96",
  };

  const isWord = card.type === 'word';
  const isImageContent = typeof card.content === 'string' && (card.content.match(/\.(jpg|jpeg|png|webp|gif)$/i) || card.content.includes('_'));

  return (
    <div 
      className={cn("relative perspective-1000 cursor-pointer group", sizeClasses[size], className)}
      onClick={onClick}
      data-testid={`card-${card.id}`}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT SIDE (Content) */}
        <div className={cn(
          "absolute inset-0 backface-hidden w-full h-full rounded-xl shadow-lg border border-border/50 overflow-hidden",
          "bg-white flex items-center justify-center",
          isWord && !isImageContent ? "p-6" : "p-0"
        )}>
          {isWord && !isImageContent ? (
            <div className="text-center w-full h-full flex flex-col items-center justify-center">
               {/* Word cards often have a smaller word inside a frame or just text */}
               <div className="border-2 border-primary/10 rounded-lg p-4 w-full h-full flex items-center justify-center">
                 <span className="font-display font-bold text-2xl text-primary tracking-wider uppercase">
                   {card.content}
                 </span>
               </div>
               <span className="absolute bottom-2 right-4 text-xs text-muted-foreground/50 font-mono">
                 #{card.number}
               </span>
            </div>
          ) : (
            <div className="w-full h-full relative bg-gray-50 flex items-center justify-center">
              {/* Dynamic image path handling */}
              <img 
                src={card.content.startsWith('http') ? card.content : `/images/${card.content}`} 
                alt={card.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    target.style.display = 'none';
                    target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-secondary/50');
                    target.parentElement.innerHTML = `<span class="text-muted-foreground font-display text-sm">图卡 #${card.number}</span>`;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>

        {/* BACK SIDE (Cover) */}
        <div className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-xl shadow-md overflow-hidden",
          "bg-white flex items-center justify-center",
          "border border-border/50"
        )}>
          <img 
            src="/images/card_back_image.png" 
            alt="Card Back"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

// Special component for the OH Pair (Image + Word overlaid)
export function PairDisplay({ 
  imageCard, 
  wordCard, 
  isRevealed = true, 
  onClick 
}: { 
  imageCard: Card; 
  wordCard: Card; 
  isRevealed?: boolean;
  onClick?: () => void 
}) {
  return (
    <div 
      className="relative w-72 h-96 cursor-pointer perspective-1000 group"
      onClick={onClick}
      data-testid={`pair-${imageCard.id}-${wordCard.id}`}
    >
       <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden w-full h-full shadow-2xl rounded-xl overflow-hidden bg-white border border-border">
          {/* Base: Word Card (The frame) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {wordCard.content.match(/\.(jpg|jpeg|png|webp|gif)$/i) || wordCard.content.includes('_') ? (
              <img 
                src={`/images/${wordCard.content}`}
                alt={wordCard.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-white flex items-center justify-center border-t border-border/10">
                <span className="font-display font-bold text-3xl text-primary tracking-widest uppercase drop-shadow-sm">
                  {wordCard.content}
                </span>
              </div>
            )}
          </div>

          {/* Overlay: Image Card (The picture inside the frame) */}
          {/* Based on typical OH cards, the red frame is roughly 70-80% of the word card width/height */}
          {/* Increased padding by ~8px (approx 3% of 288px width is 8.6px) */}
          <div className="absolute inset-0 flex items-center justify-center z-10 p-[15%] pb-[17%]">
             <div className="w-full h-full rounded-sm overflow-hidden shadow-inner border border-border/10">
               <img 
                  src={imageCard.content.startsWith('http') ? imageCard.content : `/images/${imageCard.content}`} 
                  alt={imageCard.title}
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>

        {/* BACK */}
        <div className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-xl shadow-lg overflow-hidden",
          "bg-white flex items-center justify-center",
          "border border-border/50"
        )}>
          <img 
            src="/images/card_back_image.png" 
            alt="Card Back"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
