
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, cartCount, onOpenCart }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-900 shadow-inner group-hover:rotate-12 transition">
            <i className="fas fa-mug-hot text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">Sameer's</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => onNavigate('home')}
            className={`transition ${currentView === 'home' ? 'text-amber-300 font-bold' : 'text-white hover:text-amber-200'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('menu')}
            className={`transition ${currentView === 'menu' ? 'text-amber-300 font-bold' : 'text-white hover:text-amber-200'}`}
          >
            Menu
          </button>
          <button 
            onClick={() => onNavigate('ai-barista')}
            className={`transition ${currentView === 'ai-barista' ? 'text-amber-300 font-bold' : 'text-white hover:text-amber-200'}`}
          >
            Ask Barista AI
          </button>
        </div>

        <button 
          onClick={onOpenCart}
          className="relative p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition"
        >
          <i className="fas fa-shopping-basket text-xl"></i>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
