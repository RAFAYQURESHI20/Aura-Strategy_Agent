import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import HeroSection from "../components/HeroSection";
import StrategyInput from "../components/StrategyInput";
import ThinkingAnimation from "../components/ThinkingAnimation";
import StrategyResults from "../components/StrategyResults";
import HistorySidebar, { type HistoryEntry } from "../components/HistorySidebar";
import type { Strategy, StrategyRequest } from "../types/strategy";
import { generateStrategy } from "../services/strategyApi";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type AppState = "hero" | "input" | "thinking" | "results";

interface SavedStrategy {
  id: string;
  productName: string;
  strategy: Strategy;
  timestamp: Date;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [productName, setProductName] = useState("");
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [activeId, setActiveId] = useState<string>();

  const handleGetStarted = () => setAppState("input");

  const strategyMutation = useMutation({
    mutationFn: generateStrategy,
    onSuccess: (data: Strategy) => {
      setStrategy(data);
      const id = crypto.randomUUID();
      setActiveId(id);
      setSavedStrategies((prev) => [
        { id, productName, strategy: data, timestamp: new Date() },
        ...prev,
      ]);
      setAppState("results");
      toast.success("Strategy generated successfully!");
    },
    onError: (error: Error) => {
      setAppState("input");
      toast.error(error.message || "Failed to generate strategy. Please try again.");
    },
  });

  const handleGenerate = useCallback((request: StrategyRequest) => {
    setProductName(request.product_name);
    setAppState("thinking");
    strategyMutation.mutate(request);
  }, [strategyMutation]);

  const handleRegenerate = () => {
    if (productName) {
      // Re-run with last known inputs if available, otherwise go back to input
      setAppState("input");
    }
  };

  const handleExport = () => {
    toast.info("PDF export will be available when connected to Lovable Cloud");
  };

  const handleHistorySelect = (id: string) => {
    const saved = savedStrategies.find((s) => s.id === id);
    if (saved) {
      setProductName(saved.productName);
      setStrategy(saved.strategy);
      setActiveId(id);
      setAppState("results");
    }
  };

  const handleHistoryDelete = (id: string) => {
    setSavedStrategies((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      setActiveId(undefined);
    }
    toast("Strategy deleted");
  };

  const handleBackToHome = useCallback(() => {
    setAppState("hero");
    setStrategy(null);
  }, []);

  const history: HistoryEntry[] = savedStrategies.map((s) => ({
    id: s.id,
    productName: s.productName,
    timestamp: s.timestamp,
  }));

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <HistorySidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
        activeId={activeId}
      />

      {appState !== "hero" && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-6 right-6 z-[60] lg:right-8 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/95 backdrop-blur-sm border shadow-xl neon-glow text-foreground hover:brightness-105 font-medium text-sm transition-all duration-300"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </motion.button>
      )}

      <main
        className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
          sidebarOpen ? "pl-72" : ""
        }`}
      >
        <AnimatePresence mode="wait">
          {appState === "hero" && (
            <motion.div
              key="hero"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <HeroSection onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {appState === "input" && (
            <motion.div
              key="input"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl md:text-4xl font-bold text-foreground text-center"
              >
                What are you <span className="gradient-text">marketing</span>?
              </motion.h2>
              <StrategyInput onSubmit={handleGenerate} isLoading={strategyMutation.isPending} />
            </motion.div>
          )}

          {appState === "thinking" && (
            <motion.div
              key="thinking"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <ThinkingAnimation isLoading={strategyMutation.isPending} />
            </motion.div>
          )}

          {appState === "results" && strategy && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full py-12"
            >
              <StrategyResults
                strategy={strategy}
                productName={productName}
                onRegenerate={handleRegenerate}
                onExport={handleExport}
              />

              {/* New strategy input at bottom */}
              <div className="mt-12">
                <StrategyInput onSubmit={handleGenerate} isLoading={strategyMutation.isPending} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
