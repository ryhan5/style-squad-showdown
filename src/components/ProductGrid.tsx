
import React from 'react';
import { Camera, Heart, Share2, Sparkles } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Neon Dreams Crop Top",
    price: 89,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
    brand: "CyberFash",
    rating: 4.8,
    tryOnCount: 1247
  },
  {
    id: 2,
    name: "Holographic Mini Skirt",
    price: 156,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d37?w=400&h=600&fit=crop",
    brand: "FutureWear",
    rating: 4.9,
    tryOnCount: 2103
  },
  {
    id: 3,
    name: "LED Accent Jacket",
    price: 299,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    brand: "TechStyle",
    rating: 4.7,
    tryOnCount: 856
  },
  {
    id: 4,
    name: "Gradient Mesh Bodysuit",
    price: 124,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
    brand: "NeonVibes",
    rating: 4.6,
    tryOnCount: 1789
  },
  {
    id: 5,
    name: "Prismatic Platform Boots",
    price: 245,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop",
    brand: "ChromeFeet",
    rating: 4.8,
    tryOnCount: 934
  },
  {
    id: 6,
    name: "Cosmic Print Leggings",
    price: 78,
    image: "https://images.unsplash.com/photo-1506629905307-50cc33b18129?w=400&h=600&fit=crop",
    brand: "GalaxyFit",
    rating: 4.5,
    tryOnCount: 1456
  }
];

const ProductGrid = ({ onTryOn, onAddToCart }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Collection</h2>
        <div className="flex items-center space-x-2 text-white/80">
          <Sparkles className="w-5 h-5" />
          <span>Live from Virtual Pop-Up</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Try-On Badge */}
                <div className="absolute bottom-4 left-4 bg-pink-500/90 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
                  {product.tryOnCount.toLocaleString()} tried on
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-pink-300 text-sm font-medium">{product.brand}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-white mb-4">${product.price}</p>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onTryOn(product)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Try On</span>
                  </button>
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-3 bg-white/20 backdrop-blur text-white rounded-xl hover:bg-white/30 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
