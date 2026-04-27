import { motion } from "framer-motion";
import {
  Users, Search, Megaphone, FileText, PenTool,
  DollarSign, TrendingUp, RefreshCw, Download
} from "lucide-react";
import StrategyCard from "./StrategyCard";
import type { Strategy } from "../types/strategy";

interface StrategyResultsProps {
  strategy: Strategy;
  productName: string;
  onRegenerate: () => void;
  onExport: () => void;
}

export default function StrategyResults({ strategy, productName, onRegenerate, onExport }: StrategyResultsProps) {
  const cards = [
    { title: "Target Audience", icon: Users, content: strategy.audience.summary, items: strategy.audience.segments },
    { title: "Competitor Analysis", icon: Search, content: strategy.competitors.summary, items: strategy.competitors.names },
    { title: "Marketing Channels", icon: Megaphone, content: strategy.channels.summary, items: strategy.channels.list },
    { title: "Content Strategy", icon: FileText, content: strategy.content.summary, items: strategy.content.types },
    { title: "Ad Copy", icon: PenTool, content: strategy.adCopy.summary, items: strategy.adCopy.examples },
    { title: "Budget Allocation", icon: DollarSign, content: strategy.budget.summary, items: strategy.budget.breakdown },
    { title: "Growth Plan", icon: TrendingUp, content: strategy.growth.summary, items: strategy.growth.milestones },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Strategy for <span className="gradient-text">{productName}</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">AI-generated marketing strategy</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegenerate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium glass-surface hover:border-primary/30 text-foreground transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground transition-all"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <StrategyCard key={card.title} {...card} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
