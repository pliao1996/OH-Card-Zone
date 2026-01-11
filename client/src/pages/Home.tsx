import { Link } from "wouter";
import { ArrowRight, Layers, Grid } from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium tracking-wide">
            探索你的内心世界
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight">
            用 OH 卡开启潜意识之门
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            一个关于直觉、叙事和自我发现的工具。
            通过图像和文字的组合，揭示新的视角和隐藏的意义。
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 w-full max-w-2xl"
        >
          {/* Gallery Card */}
          <Link href="/gallery" className="group relative block p-8 rounded-3xl bg-white border border-border/50 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 w-24 md:w-32 transform rotate-6 opacity-80 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300 z-20">
              <img 
                src="/images/oh_box_cover.png" 
                alt="OH Cards Box" 
                className="rounded-lg shadow-md border-2 border-white/50"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full items-start text-left">
              <div className="p-3 rounded-xl bg-secondary text-primary mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                <Grid className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">浏览收藏</h3>
              <p className="text-muted-foreground mb-6 max-w-[60%]">探索完整的 88 张图卡和 100 张字卡。</p>
              <div className="mt-auto flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                查看画廊 <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Spreads Card */}
          <Link href="/spreads" className="group relative block p-8 rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
             <div className="absolute -bottom-4 -right-4 p-4 opacity-10">
              <Layers className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full items-start text-left">
              <div className="p-3 rounded-xl bg-white/10 text-white mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">开始抽取</h3>
              <p className="text-primary-foreground/80 mb-6">抽取卡片以获取对问题或现状的洞察。</p>
              <div className="mt-auto flex items-center text-white font-medium group-hover:translate-x-1 transition-transform">
                开始探索 <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="mt-24 py-16 border-t border-border/30">
        <div className="grid md:grid-cols-3 gap-12 text-center">
           <div className="space-y-4">
             <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
               <span className="font-display text-3xl font-bold">88</span>
             </div>
             <h3 className="text-xl font-bold">图卡</h3>
             <p className="text-muted-foreground">描绘日常生活场景，唤起情感和记忆。</p>
           </div>
           <div className="space-y-4">
             <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
               <span className="font-display text-3xl font-bold">100</span>
             </div>
             <h3 className="text-xl font-bold">字卡</h3>
             <p className="text-muted-foreground">为图像提供框架或背景的词汇。</p>
           </div>
           <div className="space-y-4">
             <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
               <span className="font-display text-3xl font-bold">∞</span>
             </div>
             <h3 className="text-xl font-bold">无限可能</h3>
             <p className="text-muted-foreground">每次组合都会产生独特的解读。</p>
           </div>
        </div>
      </section>
    </Layout>
  );
}
