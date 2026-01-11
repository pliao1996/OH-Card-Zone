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
            Explore Your Inner World
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight">
            Unlock the Subconscious <br/> with OH Cards
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A tool for intuition, storytelling, and self-discovery. 
            Combine images and words to reveal new perspectives and hidden meanings.
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
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Grid className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col h-full items-start text-left">
              <div className="p-3 rounded-xl bg-secondary text-primary mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                <Grid className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Browse Collection</h3>
              <p className="text-muted-foreground mb-6">Explore the full deck of 88 images and 100 words.</p>
              <div className="mt-auto flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                View Gallery <ArrowRight className="ml-2 w-4 h-4" />
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
              <h3 className="text-2xl font-bold text-white mb-2">Start a Spread</h3>
              <p className="text-primary-foreground/80 mb-6">Draw cards to gain insight into a question or situation.</p>
              <div className="mt-auto flex items-center text-white font-medium group-hover:translate-x-1 transition-transform">
                Start Drawing <ArrowRight className="ml-2 w-4 h-4" />
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
             <h3 className="text-xl font-bold">Image Cards</h3>
             <p className="text-muted-foreground">Depicting scenes from daily life to evoke feelings and memories.</p>
           </div>
           <div className="space-y-4">
             <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
               <span className="font-display text-3xl font-bold">100</span>
             </div>
             <h3 className="text-xl font-bold">Word Cards</h3>
             <p className="text-muted-foreground">Words that provide a framework or context for the images.</p>
           </div>
           <div className="space-y-4">
             <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
               <span className="font-display text-3xl font-bold">∞</span>
             </div>
             <h3 className="text-xl font-bold">Endless Meanings</h3>
             <p className="text-muted-foreground">The combination creates unique interpretations every time.</p>
           </div>
        </div>
      </section>
    </Layout>
  );
}
