import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { StrategyRequest } from "../types/strategy";

interface StrategyInputProps {
  onSubmit: (request: StrategyRequest) => void;
  isLoading: boolean;
}

const suggestions = [
  "A sustainable fashion brand for Gen Z",
  "B2B SaaS project management tool",
  "Direct-to-consumer pet food startup",
  "AI-powered fitness coaching app",
];

const suggestionData: Record<string, StrategyRequest> = {
  "A sustainable fashion brand for Gen Z": {
    product_name: "EcoThreads",
    product_description: "A sustainable fashion brand offering eco-friendly, ethically-made clothing for Gen Z consumers who care about the environment and social impact.",
    target_audience: "Gen Z consumers aged 18-26, environmentally conscious, urban, active on TikTok and Instagram",
    budget: "Rs. 50000",
  },
  "B2B SaaS project management tool": {
    product_name: "TaskFlow Pro",
    product_description: "A B2B SaaS project management tool designed for remote teams with AI-powered task prioritization, time tracking, and automated reporting.",
    target_audience: "Remote team managers and startup founders at small-to-medium tech companies",
    budget: "Rs. 100000",
  },
  "Direct-to-consumer pet food startup": {
    product_name: "Pawfect Meals",
    product_description: "A direct-to-consumer pet food startup delivering personalized, vet-approved fresh meals for dogs and cats based on breed, age, and health needs.",
    target_audience: "Pet owners aged 28-45, urban households, willing to pay premium for pet health",
    budget: "Rs. 75000",
  },
  "AI-powered fitness coaching app": {
    product_name: "FitAI Coach",
    product_description: "An AI-powered fitness coaching app that creates personalized workout and nutrition plans based on user biometrics, goals, and real-time feedback.",
    target_audience: "Health-conscious individuals aged 22-40, gym-goers and home workout enthusiasts",
    budget: "Rs. 60000",
  },
};

export default function StrategyInput({ onSubmit, isLoading }: StrategyInputProps) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<StrategyRequest>({
    product_name: "",
    product_description: "",
    target_audience: "",
    budget: "",
  });

  const handleChange = (field: keyof StrategyRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.product_name.trim() && !isLoading) {
      onSubmit(form);
    }
  };

  const isValid =
    form.product_name.trim() &&
    form.product_description.trim().length >= 10 &&
    form.target_audience.trim() &&
    form.budget.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="glass-surface-strong neon-glow p-2 rounded-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary ml-4 shrink-0" />
            <input
              type="text"
              value={form.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
              placeholder="Product name..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 px-2 text-lg"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={!isValid || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Less details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> More details
            </>
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-3"
          >
            <div className="glass-surface p-3 rounded-xl">
              <textarea
                value={form.product_description}
                onChange={(e) => handleChange("product_description", e.target.value)}
                placeholder="Describe your product in detail..."
                rows={3}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-surface p-3 rounded-xl">
                <input
                  type="text"
                  value={form.target_audience}
                  onChange={(e) => handleChange("target_audience", e.target.value)}
                  placeholder="Target audience..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="glass-surface p-3 rounded-xl">
                <input
                  type="text"
                  value={form.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="Budget (e.g. Rs. 50000)..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>
        )}
      </form>

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              const data = suggestionData[s];
              if (data) {
                setForm(data);
                setExpanded(true);
              }
            }}
            className="px-4 py-2 rounded-full text-sm text-muted-foreground glass-surface hover:border-primary/30 transition-all duration-200"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
