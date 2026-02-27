import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="absolute inset-0"
      >
        <img
          src="/images/hero-tomatoes.jpg"
          alt="Fresh organic tomatoes in baskets"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-farm-dark/70 via-farm-dark/50 to-farm-dark/70" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20"
      >
        {/* Subtitle */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-farm-mint/60"
          >
            <path
              d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm tracking-[0.3em] uppercase text-farm-mint/90 font-medium">
            Welcome
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-farm-mint/60"
          >
            <path
              d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-white leading-tight mb-10"
        >
          Empowering Farmers
          <br />
          Beyond Harvest
        </motion.h1>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            className="bg-farm-mint hover:bg-farm-mint/90 text-farm-dark px-8 py-6 text-base font-medium rounded-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <a href="#about">Our Farm</a>
          </Button>
          <Button
            asChild
            variant="default"
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-8 py-6 text-base font-medium rounded-md transition-all duration-200 hover:scale-105"
          >
            <a href="#warehouse">Discover</a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
