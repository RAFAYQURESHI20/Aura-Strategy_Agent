import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StrategyCardProps {
  title: string;
  icon: LucideIcon;
  content: string;
  items?: string[];
  index: number;
  accentColor?: string;
}

export default function StrategyCard({ title, icon: Icon, content, items, index, accentColor = "primary" }: StrategyCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    const text = items ? `${title}\n\n${content}\n\n${items.join("\n")}` : `${title}\n\n${content}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-surface p-6 rounded-2xl hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-${accentColor}/10`}>
            <Icon className={`h-5 w-5 text-${accentColor}`} />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{content}</p>
          {items && items.length > 0 && (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
