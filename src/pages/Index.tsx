
import React, { useState } from 'react';
import { ShoppingBag, Users, Sparkles, Heart, Share2, Camera, Star, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const features = [
    {
      icon: Camera,
      title: "Virtual Try-On",
      description: "Experience clothes in AR before you buy. See how they fit and look on you instantly."
    },
    {
      icon: Users,
      title: "Shop with Friends",
      description: "Invite friends to your virtual fitting room. Get real-time opinions and reactions."
    },
    {
      icon: Sparkles,
      title: "AI Personal Stylist",
      description: "Get personalized recommendations based on your style, preferences, and body type."
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Love what you tried? Get it delivered to your door within 24 hours."
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Virtual Try-Ons" },
    { number: "1M+", label: "Style Recommendations" },
    { number: "24hrs", label: "Average Delivery" }
  ];

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
              <a href="#features" className="text-gray-700 hover:text-black transition-colors font-medium">Features</a>
              <Link to="/shop" className="text-gray-700 hover:text-black transition-colors font-medium">Shop</Link>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Try-On</a>
              <Link to="/ai-stylist" className="text-gray-700 hover:text-black transition-colors font-medium">AI Stylist</Link>
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
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
              Fashion
              <br />
              <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of shopping with virtual try-ons, AI styling, and social shopping. 
              Try before you buy, get styled by AI, and shop with friends in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-lg">
                <Camera className="w-5 h-5" />
                <span>Start Virtual Try-On</span>
              </button>
              <button className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-lg">
                <span>Explore Collection</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Why Choose <span className="font-semibold">StyleSync</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining cutting-edge technology with personalized service to revolutionize your shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-light text-gray-900 mb-8 leading-relaxed">
            "StyleSync completely changed how I shop. The virtual try-ons are incredibly accurate, 
            and shopping with friends makes it so much more fun!"
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&h=60&fit=crop&crop=face" 
              alt="Sarah M."
              className="w-12 h-12 rounded-full"
            />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Sarah Martinez</div>
              <div className="text-gray-600 text-sm">Fashion Enthusiast</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-white mb-6">Featured Collection</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our curated selection of premium fashion pieces, handpicked by our style experts.
            </p>
            <Link 
              to="/shop"
              className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
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
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Ready to Transform Your <span className="font-semibold">Shopping Experience?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of fashion-forward shoppers who've already discovered the future of retail.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Get Started Free</span>
            </button>
            <button className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="text-white font-semibold text-xl">StyleSync</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The future of fashion retail. Virtual try-ons, AI styling, and social shopping in one seamless experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Virtual Try-On</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Stylist</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Social Shopping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 StyleSync. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>

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
