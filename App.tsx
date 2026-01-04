
import React, { useState, useEffect } from 'react';
import { ViewState, MenuItem, CartItem } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import BaristaAI from './components/BaristaAI';
import CartModal from './components/CartModal';
import RecommenderAI from './components/RecommenderAI';
import { fetchMenu, placeOrder, ConnectionStatus } from './services/firebaseService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('cloud');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingMenu(true);
      const result = await fetchMenu();
      setMenuItems(result.items);
      setConnStatus(result.status);
      setIsLoadingMenu(false);
    };
    loadData();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
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

  const handleCheckout = async () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal * 1.08;
    
    try {
      const result = await placeOrder(cart, total);
      setCart([]);
      setIsCartOpen(false);
      const msg = result.status === 'cloud' 
        ? `Order synced to Cloud! ID: ${result.id}`
        : `Order saved locally! ID: ${result.id}`;
      alert(msg);
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-200">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow pt-16">
        {isLoadingMenu ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-amber-900 font-medium animate-pulse-slow">Warming up the espresso machine...</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <>
                <Hero onExplore={() => setCurrentView('menu')} />
                <RecommenderAI onAddToCart={addToCart} menuOverride={menuItems} />
                <section className="bg-stone-100 py-16">
                  <div className="max-container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8 text-amber-900">Featured Blends</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {menuItems.slice(0, 3).map(item => (
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
              <MenuSection onAddToCart={addToCart} menuItems={menuItems} />
            )}

            {currentView === 'ai-barista' && (
              <BaristaAI menuItems={menuItems} />
            )}
          </>
        )}
      </main>

      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-stone-800 pb-8 gap-6">
             <div>
              <h3 className="text-white text-xl font-bold mb-2">Sameer's Coffee Shop</h3>
              <p className="text-sm max-w-xs">Crafting moments of joy, one cup at a time. Using AI and modern tech to serve you better.</p>
            </div>
            <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-700 flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${connStatus === 'cloud' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-blue-500'}`}></div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  {connStatus === 'cloud' ? 'Cloud Connected' : 'Demo Mode (Local)'}
                </p>
                <p className="text-[10px] text-stone-500">
                  {connStatus === 'cloud' ? 'Synced with Firestore' : 'Running locally - Cloud setup pending'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-white text-md font-bold mb-4 uppercase tracking-wider">Location & Hours</h3>
              <p className="text-sm">123 Espresso Lane, Coffee City</p>
              <p className="text-sm">Mon-Fri: 7am - 8pm | Sat-Sun: 8am - 9pm</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-white text-md font-bold mb-4 uppercase tracking-wider">Follow Us</h3>
              <div className="flex space-x-4 md:justify-end">
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-instagram text-xl"></i></a>
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-facebook text-xl"></i></a>
                <a href="#" className="hover:text-amber-500 transition"><i className="fab fa-twitter text-xl"></i></a>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-stone-600">
            &copy; 2024 Sameer's Coffee Shop App. Built with Gemini AI & React.
          </p>
        </div>
      </footer>

      {isCartOpen && (
        <CartModal 
          items={cart} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default App;
