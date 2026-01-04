
import React, { useState } from 'react';
import { MenuItem } from '../types';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, menuItems }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Tea', 'Pastries'];
  
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-12 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">Our Menu</h1>
          <p className="text-stone-600 max-w-xl mx-auto">Explore our curated selection of beverages and artisanal pastries made fresh every morning.</p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-amber-800 text-white shadow-lg' 
                  : 'bg-white text-stone-600 hover:bg-amber-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold text-amber-900 shadow-sm">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h3>
                <p className="text-stone-500 text-sm mb-6 h-10 line-clamp-2">{item.description}</p>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="w-full py-3 bg-amber-800 text-white rounded-2xl hover:bg-amber-900 transition flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-plus text-sm"></i>
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
