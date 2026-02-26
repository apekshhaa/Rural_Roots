import { motion } from 'framer-motion';
import { Youtube, Facebook, Linkedin } from 'lucide-react';

const exploreLinks = [
  { name: 'Harvest', href: '#selection' },
  { name: 'Selection', href: '#selection' },
  { name: 'Store', href: '#shop' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Questions', href: '#' },
  { name: 'Visit us', href: '#' },
];

const infoLinks = [
  { name: 'Instructions', href: '#' },
  { name: 'Licenses', href: '#' },
  { name: 'Style guide', href: '#' },
];

const mainNavLinks = [
  { name: 'Home', href: '#' },
  { name: 'Our Farm', href: '#about' },
  { name: 'Practices', href: '#sustainable' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#footer' },
];

const socialLinks = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer id="footer" className="relative bg-farm-dark overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/farm-landscape.jpg"
          alt="Farm background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-farm-dark via-farm-dark/95 to-farm-dark/90" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12"
          >
            {/* Logo & Tagline */}
            <div className="lg:max-w-sm">
              <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-white mb-4">
                Rural Roots
              </h2>
              <p className="text-white/60">
                Agriculture Webflow template designed for farm websites
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-12">
              <a
                href="mailto:our.farm@example.com"
                className="text-white/80 hover:text-farm-mint transition-colors"
              >
                our.farm@example.com
              </a>
              <a
                href="tel:+15551234567"
                className="text-white/80 hover:text-farm-mint transition-colors"
              >
                (555) 123-4567-894
              </a>
            </div>
          </motion.div>

          {/* Main Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-4 lg:gap-8 mb-12 pb-12 border-b border-white/10"
          >
            {mainNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl lg:text-3xl font-serif text-farm-mint hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </motion.div>

          {/* Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
          >
            {/* Explore */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4">
                Explore
              </h3>
              <ul className="space-y-3">
                {exploreLinks.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-farm-mint transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4 opacity-0">
                Explore
              </h3>
              <ul className="space-y-3">
                {exploreLinks.slice(3).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-farm-mint transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4">
                Information
              </h3>
              <ul className="space-y-3">
                {infoLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-farm-mint transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4">
                Address
              </h3>
              <address className="not-italic text-white/70 space-y-1">
                <p>Green Valley Organic Farm</p>
                <p>127 Harvest Lane</p>
                <p>Willow Creek, 40360</p>
              </address>

              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4 mt-6">
                Farm Store
              </h3>
              <address className="not-italic text-white/70 space-y-1">
                <p>The Farm Market</p>
                <p>56 Freshfield Avenue</p>
                <p>Sunnydale, 91016</p>
              </address>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 border border-white/30 rounded flex items-center justify-center text-white/70 hover:text-farm-mint hover:border-farm-mint transition-all duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
                <span>Powered by Webflow</span>
                <span className="hidden sm:inline">|</span>
                <span>Made by Metrik</span>
                <span className="hidden sm:inline">|</span>
                <a href="#" className="hover:text-farm-mint transition-colors">
                  Webflow templates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
