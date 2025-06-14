
import React, { useState } from 'react';
import { ShoppingBag, Users, Sparkles, Heart, Share2, Camera } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import TryOnModal from '../components/TryOnModal';
import SocialFeed from '../components/SocialFeed';
import AIStyler from '../components/AIStyler';
import ShoppingCart from '../components/ShoppingCart';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleTryOn = (product) => {
    setSelectedProduct(product);
    setShowTryOn(true);
  };

  const addToCart = (product) => {
    setCartItems(prev => [...prev, { ...product, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-900 font-semibold text-xl">StyleSync</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Shop</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Try-On</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Friends</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">AI Stylist</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-black transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowCart(true)}
                className="relative text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            Shop Together.<br />
            <span className="font-medium text-gray-800">
              Smarter. In Style.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Step into the future of fashion — where you and your friends shop side by side, 
            try on digital outfits in real-time, and let AI stylists find your perfect look.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <span className="text-2xl mb-2 block">🎮</span>
              <span className="text-gray-700 font-medium">Try on. React. Compete. Buy.</span>
            </div>
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <span className="text-2xl mb-2 block">🛍️</span>
              <span className="text-gray-700 font-medium">Digital Try-Ons. Physical Delivery.</span>
            </div>
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <span className="text-2xl mb-2 block">🤖</span>
              <span className="text-gray-700 font-medium">AI Stylists That Learn You.</span>
            </div>
            <div className="bg-gray-100 px-6 py-4 rounded-lg">
              <span className="text-2xl mb-2 block">👯‍♀️</span>
              <span className="text-gray-700 font-medium">Shop with Friends in Real Time.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid onTryOn={handleTryOn} onAddToCart={addToCart} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <AIStyler />
            <SocialFeed />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTryOn && (
        <TryOnModal 
          product={selectedProduct} 
          onClose={() => setShowTryOn(false)}
          onAddToCart={addToCart}
        />
      )}
      
      {showCart && (
        <ShoppingCart 
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateItems={setCartItems}
        />
      )}
    </div>
  );
};

export default Index;
