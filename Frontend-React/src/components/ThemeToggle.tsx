import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all duration-300 w-10 h-10 flex items-center justify-center overflow-hidden"
      aria-label="Temayı Değiştir"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-zinc-950" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-zinc-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
