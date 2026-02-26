import { motion } from 'framer-motion';
import { Lightbulb, GraduationCap } from 'lucide-react';
import { SectionLabel } from '@/components/shared/SectionLabel';

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-farm-dark max-w-3xl mx-auto leading-tight">
            The Future of Farming
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative grid grid-cols-2 gap-4">
              {/* Main Image */}
              <motion.div
                className="col-span-2 relative overflow-hidden rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/tractor-field.jpg"
                  alt="Tractor in the field"
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </motion.div>

              {/* Secondary Images */}
              <motion.div
                className="relative overflow-hidden rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/farmer-working.jpg"
                  alt="Farmer portrait"
                  className="w-full h-40 lg:h-48 object-cover"
                />
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/vineyard.jpg"
                  alt="Woman in vineyard"
                  className="w-full h-40 lg:h-48 object-cover"
                />
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-farm-primary/20 rounded-lg -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-farm-mint/40 rounded-lg -z-10" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-10"
          >
            {/* Innovation */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-farm-primary/10 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-farm-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-farm-dark mb-3">
                  Innovation
                </h3>
                <p className="text-farm-muted leading-relaxed">
                  Embracing modern techniques to enhance sustainability, innovation and
                  productivity. We combine traditional wisdom with cutting-edge technology.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-farm-primary/20" />

            {/* Education */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-farm-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-farm-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-farm-dark mb-3">
                  Education
                </h3>
                <p className="text-farm-muted leading-relaxed">
                  Inspiring future generations to value and adopt eco-friendly farming for a
                  healthier planet. We offer workshops and farm tours for schools and families.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              {[
                { value: '50+', label: 'Acres' },
                { value: '25', label: 'Years' },
                { value: '10K+', label: 'Customers' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-serif font-bold text-farm-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-farm-muted mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
