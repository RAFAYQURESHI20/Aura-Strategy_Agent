import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const steps = [
  "Analyzing your product...",
  "Identifying target audience...",
  "Researching competitors...",
  "Building channel strategy...",
  "Crafting content plan...",
  "Generating ad copy...",
  "Allocating budget...",
  "Finalizing growth plan...",
];

interface ThinkingAnimationProps {
  isLoading: boolean;
}

export default function ThinkingAnimation({ isLoading }: ThinkingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 8000); // Advance every 8 seconds — CrewAI tasks take time
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setCurrentStep(0);
    }
  }, [isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="glass-surface-strong p-8 rounded-2xl neon-glow">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-display font-semibold text-lg text-foreground">
            AI Agent is thinking...
          </span>
          <div className="flex gap-1 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < currentStep
                    ? "bg-primary"
                    : i === currentStep
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/30"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  i <= currentStep ? "text-foreground" : "text-muted-foreground/40"
                }`}
              >
                {step}
              </span>
              {i < currentStep && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-primary text-xs"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
