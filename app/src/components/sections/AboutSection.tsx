import { motion } from 'framer-motion';
import { Leaf, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionLabel } from '@/components/shared/SectionLabel';

export function AboutSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section id="about" className="relative bg-farm-cream py-20 lg:py-32 overflow-hidden">
      {/* Decorative Vegetable Border - Top */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
          <pattern id="veg-pattern" x="0" y="0" width="200" height="120" patternUnits="userSpaceOnUse">
            {/* Carrot */}
            <path d="M30 60 Q35 40 40 30 Q45 25 50 30 Q55 40 60 60 Q55 80 45 90 Q35 80 30 60" fill="currentColor" className="text-farm-primary"/>
            <path d="M45 30 L42 15 M45 30 L45 12 M45 30 L48 15" stroke="currentColor" strokeWidth="2" className="text-farm-primary"/>
            {/* Tomato */}
            <circle cx="100" cy="60" r="25" fill="currentColor" className="text-farm-primary"/>
            <path d="M100 35 L95 25 L100 30 L105 25 Z" fill="currentColor" className="text-farm-primary"/>
            {/* Leaf */}
            <ellipse cx="150" cy="60" rx="20" ry="30" fill="currentColor" className="text-farm-primary" transform="rotate(-20 150 60)"/>
            <ellipse cx="150" cy="60" rx="20" ry="30" fill="currentColor" className="text-farm-primary" transform="rotate(20 150 60)"/>
          </pattern>
          <rect x="0" y="0" width="1200" height="120" fill="url(#veg-pattern)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <SectionLabel>About</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-farm-dark max-w-3xl mx-auto leading-tight">
            Our Organic Farm Began with a Simple Dream
          </h2>
          <p className="mt-6 text-farm-muted max-w-2xl mx-auto text-lg leading-relaxed">
            to cultivate the land in harmony with nature, creating a sustainable and eco-friendly
            environment while providing the highest-quality, organic food. Since our founding,
            we've remained dedicated to sustainable farming practices that protect and nurture
            the land for future generations.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <motion.img
                src="/images/farmer-working.jpg"
                alt="Farmer working in the field"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-farm-primary/20 rounded-lg -z-10" />
          </motion.div>

          {/* Right: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="space-y-10"
          >
            {/* Our Story */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-farm-primary/10 rounded-full flex items-center justify-center">
                  <Sun className="w-8 h-8 text-farm-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-semibold text-farm-dark mb-3">
                  Our Story
                </h3>
                <p className="text-farm-muted leading-relaxed">
                  From small beginnings, we've grown into a thriving organic farm. Passionate
                  farmers dedicated to growing fresh, quality produce.
                </p>
              </div>
            </div>

            {/* Sustainability */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-farm-primary/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-farm-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-semibold text-farm-dark mb-3">
                  Sustainability
                </h3>
                <p className="text-farm-muted leading-relaxed mb-4">
                  Caring for the earth with eco-friendly farming practices. Harvested at peak
                  ripeness for unmatched flavor and nutrition.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-farm-primary text-farm-primary hover:bg-farm-primary hover:text-white"
                >
                  <a href="#sustainable">Practices</a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second Row: Image Right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-16 lg:mt-24">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="order-2 lg:order-1"
          >
            <blockquote className="text-2xl lg:text-3xl font-serif text-farm-dark italic leading-relaxed">
              "We believe in the power of nature to provide the most nutritious and delicious
              food for our community."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-farm-primary rounded-full flex items-center justify-center text-white font-serif font-semibold">
                JD
              </div>
              <div>
                <p className="font-medium text-farm-dark">John Davidson</p>
                <p className="text-sm text-farm-muted">Founder, Rural Roots</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <motion.img
                src="/images/woman-vegetables.jpg"
                alt="Woman with fresh vegetables"
                className="w-full h-[350px] lg:h-[450px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-farm-mint/50 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
