import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Grid, Layers, Menu, X, Coffee } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "首页", href: "/", icon: Home },
    { label: "卡片库", href: "/gallery", icon: Grid },
    { label: "牌阵", href: "/spreads", icon: Layers },
    { label: "赞助", href: "/sponsor", icon: Coffee },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold text-primary group-hover:text-accent transition-colors">
              OH Cards
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent flex items-center gap-2 px-3 py-2 rounded-md",
                  location === item.href 
                    ? "text-primary bg-secondary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-accent flex items-center gap-3 px-4 py-3 rounded-xl",
                      location === item.href 
                        ? "text-primary bg-secondary" 
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          key={location} // Re-animate on route change
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border/50 py-8 mt-auto bg-secondary/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">仅供学习使用，如有版权问题，请联系作者 yuanzideshi@outlook.com</p>
          <p>&copy; {new Date().getFullYear()} OH Cards Experience. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
