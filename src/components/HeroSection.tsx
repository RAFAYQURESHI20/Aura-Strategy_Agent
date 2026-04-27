import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface mb-8 neon-glow"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          AI-Powered Marketing Intelligence
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 max-w-4xl"
      >
        <span className="text-foreground">Build your </span>
        <span className="gradient-text">marketing strategy</span>
        <span className="text-foreground"> in seconds</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance"
      >
        Enter your product or idea and let our AI agent craft a complete go-to-market 
        strategy — audience, channels, content, ads, and budget — instantly.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGetStarted}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground bg-primary neon-glow-strong transition-all duration-300 hover:brightness-110"
      >
        <Zap className="h-5 w-5" />
        Generate Strategy
      </motion.button>
    </motion.div>
  );
}
