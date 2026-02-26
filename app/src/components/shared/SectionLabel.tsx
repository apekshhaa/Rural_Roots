import { motion } from 'framer-motion';

interface SectionLabelProps {
  children: string;
  light?: boolean;
}

export function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-4 mb-6"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={light ? 'text-farm-mint/60' : 'text-farm-primary/40'}
      >
        <path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
          fill="currentColor"
        />
      </svg>
      <span
        className={`text-sm tracking-[0.2em] uppercase font-medium ${
          light ? 'text-farm-mint/80' : 'text-farm-muted'
        }`}
      >
        {children}
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={light ? 'text-farm-mint/60' : 'text-farm-primary/40'}
      >
        <path
          d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
          fill="currentColor"
        />
      </svg>
    </motion.div>
  );
}
