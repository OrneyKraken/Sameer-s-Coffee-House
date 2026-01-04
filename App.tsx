
import React, { useState, useEffect } from 'react';
import { ViewState, MenuItem, CartItem } from './types';
import { MENU_ITEMS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import BaristaAI from './components/BaristaAI';
import CartModal from './components/CartModal';
import RecommenderAI from './components/RecommenderAI';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Visual feedback could be added here
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow pt-16">
        {currentView === 'home' && (
          <>
            <Hero onExplore={() => setCurrentView('menu')} />
            <RecommenderAI onAddToCart={addToCart} />
            <section className="bg-stone-100 py-16">
              <div className="max-container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-amber-900">Featured Blends</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {MENU_ITEMS.slice(0, 3).map(item => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-105">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{item.name}</h3>
                        <p className="text-stone-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition"
                        >
                          Add to Order • ${item.price.toFixed(2)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'menu' && (
          <MenuSection onAddToCart={addToCart} />
        )}

        {currentView === 'ai-barista' && (
          <BaristaAI />
        )}
      </main>

      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-800 pb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Sameer's Coffee Shop</h3>
              <p className="text-sm">Crafting moments of joy, one cup at a time. From bean to brew, we prioritize quality and connection.</p>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Location & Hours</h3>
              <p className="text-sm">123 Espresso Lane, Coffee City</p>
              <p className="text-sm">Mon-Fri: 7am - 8pm</p>
              <p className="text-sm">Sat-Sun: 8am - 9pm</p>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-instagram text-2xl"></i></a>
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-facebook text-2xl"></i></a>
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-twitter text-2xl"></i></a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-stone-500">
            &copy; 2024 Sameer's Coffee Shop App. All rights reserved.
          </p>
        </div>
      </footer>

      {isCartOpen && (
        <CartModal 
          items={cart} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
        />
      )}
    </div>
  );
};

export default App;
