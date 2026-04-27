import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronLeft, ChevronRight, Clock, Trash2 } from "lucide-react";

export interface HistoryEntry {
  id: string;
  productName: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  history: HistoryEntry[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

export default function HistorySidebar({ isOpen, onToggle, history, onSelect, onDelete, activeId }: HistorySidebarProps) {
  return (
    <>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-surface-strong text-muted-foreground hover:text-foreground transition-colors"
      >
        {isOpen ? <ChevronLeft className="h-5 w-5" /> : <History className="h-5 w-5" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-40 glass-surface-strong border-r border-border p-4 pt-16 overflow-y-auto"
          >
            <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Strategy History
            </h2>

            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No strategies yet. Generate your first one!</p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ x: 4 }}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      activeId === entry.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => onSelect(entry.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{entry.productName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {entry.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                      className="p-1.5 rounded-lg text-muted-foreground/0 group-hover:text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
