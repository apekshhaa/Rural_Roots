export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badges: ('featured' | 'sale')[];
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
