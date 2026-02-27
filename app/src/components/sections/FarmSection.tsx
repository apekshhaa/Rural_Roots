import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { KrishiSightDashboard } from './KrishiSightDashboard';

export function FarmSection() {
  return (
    <section id="farm" className="relative bg-farm-cream py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel>The Farm</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-farm-dark max-w-3xl mx-auto leading-tight mb-4">
            KrishiSight Market Intelligence
          </h2>
          <p className="text-farm-muted max-w-2xl mx-auto">
            Empowering farmers with real-time data, AI-driven price forecasts, and market insights for better decision making.
          </p>
        </motion.div>

        {/* Dashboard Integration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <KrishiSightDashboard />
        </motion.div>
      </div>
    </section>
  );
}
