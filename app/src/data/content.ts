import type { Product, BlogPost } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Guided Farm Tour',
    description: 'Embark on a 1-hour guided tour of our farm to explore the fields and learn about farming practices.',
    price: 15,
    image: '/images/vineyard.jpg',
    badges: ['featured'],
  },
  {
    id: '2',
    name: 'Family Fresh Basket',
    description: 'Feed your family with a basket full of farm-fresh, seasonal produce. Perfect for delicious, healthy meals.',
    price: 99,
    originalPrice: 129,
    image: '/images/fresh-basket.jpg',
    badges: ['featured', 'sale'],
  },
  {
    id: '3',
    name: 'Seasonal Veggie Basket',
    description: 'A handpicked assortment of the freshest, seasonal vegetables straight from our fields to your table.',
    price: 79,
    originalPrice: 99,
    image: '/images/veggie-basket.jpg',
    badges: ['sale'],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Seasonal rhythms: How farmers adapt to nature\'s cycle',
    image: '/images/blog-rabbit.jpg',
    tags: ['Featured', 'Stories from the Farm'],
    author: {
      name: 'Ella Greenfield',
      avatar: '/images/farmer-working.jpg',
    },
  },
  {
    id: '2',
    title: 'Natural pest control methods every farmer should know',
    image: '/images/blog-cabbage.jpg',
    tags: ['Featured', 'Sustainable Farming'],
    author: {
      name: 'Ella Greenfield',
      avatar: '/images/farmer-working.jpg',
    },
  },
  {
    id: '3',
    title: 'The benefits of organic composting for healthier crops',
    image: '/images/blog-potatoes.jpg',
    tags: ['Featured', 'Sustainable Farming'],
    author: {
      name: 'Ella Greenfield',
      avatar: '/images/farmer-working.jpg',
    },
  },
];

export const categories = [
  {
    name: 'Fresh Produce',
    description: 'Seasonal fruits, vegetables, greens, and root crops.',
    image: '/images/fresh-produce.jpg',
  },
  {
    name: 'Dairy & Eggs',
    description: 'Organic milk, cheese, yogurt, and free-range eggs.',
    image: '/images/dairy-eggs.jpg',
  },
  {
    name: 'Baked Goods',
    description: 'Homemade bread, pastries, cookies, and snacks.',
    image: '/images/baked-goods.jpg',
  },
];

export const galleryImages = [
  '/images/vineyard.jpg',
  '/images/farmer-cabbage.jpg',
  '/images/tomatoes-vine.jpg',
  '/images/farm-landscape.jpg',
  '/images/tractor-field.jpg',
];
