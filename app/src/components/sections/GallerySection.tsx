import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { galleryImages } from '@/data/content';

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + galleryImages.length) % galleryImages.length;
  };

  return (
    <section id="gallery" className="relative bg-farm-dark py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel light>Gallery</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white max-w-3xl mx-auto leading-tight">
            A Glimpse of Farm Life
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Carousel Container */}
          <div className="flex items-center justify-center gap-4 lg:gap-8">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="hidden md:flex flex-shrink-0 w-12 h-12 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Images Container */}
            <div className="relative w-full max-w-4xl h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {/* Left Preview */}
                <motion.div
                  key={`left-${getSlideIndex(-1)}`}
                  initial={{ opacity: 0, x: -100, scale: 0.8 }}
                  animate={{ opacity: 0.4, x: '-120%', scale: 0.7 }}
                  exit={{ opacity: 0, x: -200, scale: 0.6 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute hidden lg:block w-1/3 h-4/5 overflow-hidden rounded-lg"
                >
                  <img
                    src={galleryImages[getSlideIndex(-1)]}
                    alt="Farm gallery"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Center Active */}
                <motion.div
                  key={`center-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative w-full lg:w-2/3 h-full overflow-hidden rounded-xl shadow-2xl z-10"
                >
                  <img
                    src={galleryImages[currentIndex]}
                    alt="Farm gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-farm-dark/40 to-transparent" />
                </motion.div>

                {/* Right Preview */}
                <motion.div
                  key={`right-${getSlideIndex(1)}`}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 0.4, x: '120%', scale: 0.7 }}
                  exit={{ opacity: 0, x: 200, scale: 0.6 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute hidden lg:block w-1/3 h-4/5 overflow-hidden rounded-lg"
                >
                  <img
                    src={galleryImages[getSlideIndex(1)]}
                    alt="Farm gallery"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="hidden md:flex flex-shrink-0 w-12 h-12 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-12 h-12 border-white/30 text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 border-white/30 text-white hover:bg-white/10 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-farm-mint w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
