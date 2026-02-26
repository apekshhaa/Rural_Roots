import { motion } from 'framer-motion';
import { Sprout, Heart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionLabel } from '@/components/shared/SectionLabel';

const features = [
  {
    icon: Sprout,
    title: 'Roots',
    description: 'Founded with a vision to reconnect people with nature.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Our farm thrives thanks to the passionate hands and hearts behind it.',
  },
  {
    icon: Truck,
    title: 'Freshness',
    description: 'We believe in shortening the distance between our fields and your table.',
  },
];

export function SustainableSection() {
  return (
    <section
      id="sustainable"
      className="relative bg-farm-dark py-20 lg:py-32 overflow-hidden"
    >
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="leaf-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-farm-mint"/>
            <path d="M25 10 Q35 25 25 40 Q15 25 25 10" fill="currentColor" className="text-farm-mint"/>
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#leaf-pattern)"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel light>Sustainable</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white max-w-4xl mx-auto leading-tight mb-8">
            Protect the Environment While Delivering High-Quality Produce
          </h2>
          <Button
            asChild
            className="bg-farm-mint hover:bg-farm-mint/90 text-farm-dark px-8 py-6 text-base font-medium rounded-md transition-all duration-200 hover:scale-105"
          >
            <a href="#shop">Our Offerings</a>
          </Button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6"
              >
                <feature.icon className="w-16 h-16 text-farm-mint/80" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-2xl font-serif font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
