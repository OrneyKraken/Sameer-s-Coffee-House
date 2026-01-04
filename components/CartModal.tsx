
import React from 'react';
import { CartItem } from '../types';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({ items, onClose, onRemove, onUpdateQty }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-amber-900 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <i className="fas fa-shopping-basket mr-3"></i>
            Your Order
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-coffee text-6xl text-stone-200 mb-4"></i>
              <p className="text-stone-500 font-medium">Your basket is currently empty.</p>
              <button 
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                <div className="flex-grow">
                  <h4 className="font-bold text-stone-900">{item.name}</h4>
                  <p className="text-amber-800 font-medium">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <div className="flex items-center bg-stone-100 rounded-lg">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 transition text-stone-600"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 transition text-stone-600"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-600 transition text-sm flex items-center"
                    >
                      <i className="far fa-trash-alt mr-1"></i> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-3">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total</span>
              <span className="text-amber-900">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-4 mt-4 bg-amber-800 hover:bg-amber-900 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-95">
              Place My Order
            </button>
            <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest mt-4">
              <i className="fas fa-shield-alt mr-1"></i> Secure Checkout at Sameer's
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
