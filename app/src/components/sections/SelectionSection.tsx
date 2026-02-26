import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { categories } from '@/data/content';

export function SelectionSection() {
  return (
    <section
      id="selection"
      className="relative min-h-[80vh] flex items-center py-20 lg:py-32 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/farm-landscape.jpg"
          alt="Misty farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-farm-dark/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel light>Selection</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white max-w-3xl mx-auto leading-tight">
            Discover Nature's Finest, Harvested with Care
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href="#shop"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative overflow-hidden rounded-lg bg-farm-dark/50 backdrop-blur-sm border border-white/10 hover:border-farm-mint/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-farm-dark via-farm-dark/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl lg:text-2xl font-serif font-semibold text-white mb-2 group-hover:text-farm-mint transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-farm-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
