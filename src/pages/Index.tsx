
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">StyleSync</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white hover:text-pink-200 transition-colors">Shop</a>
              <a href="#" className="text-white hover:text-pink-200 transition-colors">Try-On</a>
              <a href="#" className="text-white hover:text-pink-200 transition-colors">Friends</a>
              <a href="#" className="text-white hover:text-pink-200 transition-colors">AI Stylist</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-pink-200 transition-colors">
                <Users className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowCart(true)}
                className="relative text-white hover:text-pink-200 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Shop Together.<br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Smarter. In Style.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Step into the future of fashion — where you and your friends shop side by side, 
            try on digital outfits in real-time, and let AI stylists find your perfect look.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full border border-white/30">
              🎮 Try on. React. Compete. Buy.
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full border border-white/30">
              🛍️ Digital Try-Ons. Physical Delivery.
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full border border-white/30">
              🤖 AI Stylists That Learn You.
            </div>
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full border border-white/30">
              👯‍♀️ Shop with Friends in Real Time.
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
