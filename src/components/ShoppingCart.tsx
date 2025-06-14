
import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const ShoppingCart = ({ items, onClose, onUpdateItems }) => {
  const updateQuantity = (itemId, change) => {
    onUpdateItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, (item.quantity || 1) + change) }
          : item
      ).filter(item => (item.quantity || 1) > 0)
    );
  };

  const removeItem = (itemId) => {
    onUpdateItems(prev => prev.filter(item => item.id !== itemId));
  };

  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/10 backdrop-blur-md border-l border-white/20">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-white/70 mt-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm">Start adding some amazing items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm">{item.name}</h3>
                      <p className="text-white/70 text-xs">{item.brand}</p>
                      <p className="text-white font-bold text-lg">${item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-white/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity || 1}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-white font-bold">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Total</span>
              <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
            </div>
            
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
              Checkout
            </button>
            
            <p className="text-center text-white/70 text-xs mt-3">
              🚚 Free shipping on orders over $150
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
