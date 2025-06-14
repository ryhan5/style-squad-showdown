
import React, { useState } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal, Star } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import TryOnModal from '../components/TryOnModal';
import ShoppingCart from '../components/ShoppingCart';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const handleTryOn = (product) => {
    setSelectedProduct(product);
    setShowTryOn(true);
  };

  const addToCart = (product) => {
    setCartItems(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const categories = [
    { id: 'all', name: 'All Items', count: 24 },
    { id: 'tops', name: 'Tops', count: 8 },
    { id: 'bottoms', name: 'Bottoms', count: 6 },
    { id: 'dresses', name: 'Dresses', count: 5 },
    { id: 'accessories', name: 'Accessories', count: 5 }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'under-50', name: 'Under $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100-200', name: '$100 - $200' },
    { id: 'over-200', name: 'Over $200' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest' },
    { id: 'rating', name: 'Best Rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-gray-900 font-semibold text-xl">StyleSync</span>
              </a>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-black transition-colors font-medium">Home</a>
              <a href="/shop" className="text-black font-medium">Shop</a>
              <a href="/ai-stylist" className="text-gray-700 hover:text-black transition-colors font-medium">AI Stylist</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCart(true)}
                className="relative text-gray-600 hover:text-black transition-colors"
              >
                <span className="material-icons">shopping_bag</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Shop Collection</h1>
          <p className="text-gray-600 text-lg">Discover our curated selection of premium fashion pieces</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-sm opacity-75">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setPriceRange(range.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      priceRange === range.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:border-black hover:text-black transition-colors text-sm"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">24 products</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <ProductGrid onTryOn={handleTryOn} onAddToCart={addToCart} />
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

export default Shop;
