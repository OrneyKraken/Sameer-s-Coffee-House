
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Hot Coffee' | 'Cold Coffee' | 'Tea' | 'Pastries';
  image: string;
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type ViewState = 'home' | 'menu' | 'ai-barista' | 'cart';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
