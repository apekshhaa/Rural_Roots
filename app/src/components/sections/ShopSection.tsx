import { motion } from 'framer-motion';
import { Star, Tag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { products } from '@/data/content';
import type { Product } from '@/types';

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
}

export function ShopSection({ onAddToCart }: ShopSectionProps) {
  return (
    <section id="shop" className="relative bg-farm-cream py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel>Online Shop</SectionLabel>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-farm-dark max-w-3xl mx-auto leading-tight">
            Seasonal Favorites Await
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 lg:h-64 overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.badges.includes('featured') && (
                    <Badge className="bg-farm-mint text-farm-dark hover:bg-farm-mint flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </Badge>
                  )}
                  {product.badges.includes('sale') && (
                    <Badge className="bg-farm-dark text-white hover:bg-farm-dark flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Overlay Buttons */}
                <div className="absolute inset-0 bg-farm-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-farm-dark"
                  >
                    Detail
                  </Button>
                  <Button
                    className="bg-farm-mint text-farm-dark hover:bg-farm-mint/90"
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold text-farm-dark mb-2 group-hover:text-farm-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-farm-muted text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold text-farm-primary">
                    ${product.price.toFixed(2)} USD
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-farm-muted line-through">
                      ${product.originalPrice.toFixed(2)} USD
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            className="border-farm-primary text-farm-primary hover:bg-farm-primary hover:text-white px-8 py-6"
          >
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
