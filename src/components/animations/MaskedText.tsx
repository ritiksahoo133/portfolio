import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MaskedTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Editorial word-by-word masked reveal with crisp vertical clip transitions and zero bounce.
 */
export function MaskedText({
  text,
  className = '',
  highlightWords = [],
  highlightClassName = 'animate-gradient-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-700 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-emerald-400',
  delay = 0.08,
  stagger = 0.055,
}: MaskedTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');
  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));

  if (reducedMotion) {
    return (
      <span className={className}>
        {words.map((word, index) => {
          const clean = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const isHighlighted = highlightSet.has(clean);
          return (
            <span key={`${word}-${index}`} className={isHighlighted ? highlightClassName : undefined}>
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => {
        const clean = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = highlightSet.has(clean);

        return (
          <span
            key={`${word}-${index}`}
            aria-hidden="true"
            className="mr-[0.26em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0"
          >
            <motion.span
              initial={{ y: '104%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.52,
                delay: delay + index * stagger,
                ease: EASE_OUT_EXPO,
              }}
              className={`inline-block ${isHighlighted ? highlightClassName : ''}`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
