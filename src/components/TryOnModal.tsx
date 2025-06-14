
import React, { useState } from 'react';
import { X, Camera, RotateCcw, Share2, Heart, ShoppingBag } from 'lucide-react';

const TryOnModal = ({ product, onClose, onAddToCart }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [reactions, setReactions] = useState([]);

  const addReaction = (emoji) => {
    const newReaction = {
      id: Date.now(),
      emoji,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Virtual Try-On</h2>
            <p className="text-white/70">{product.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Try-On Area */}
          <div className="flex-1 relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 min-h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Camera className="w-16 h-16" />
                </div>
                <p className="text-lg mb-4">Enable camera to try on {product.name}</p>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
                  Enable Camera
                </button>
              </div>
            </div>

            {/* Floating Reactions */}
            {reactions.map((reaction) => (
              <div
                key={reaction.id}
                className="absolute text-4xl animate-bounce pointer-events-none"
                style={{ left: `${reaction.x}%`, top: `${reaction.y}%` }}
              >
                {reaction.emoji}
              </div>
            ))}

            {/* Camera Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                } text-white`}
              >
                <div className={`w-6 h-6 ${isRecording ? 'rounded-sm bg-white' : 'rounded-full border-2 border-white'}`} />
              </button>
              <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 p-6 space-y-6">
            {/* Product Info */}
            <div className="bg-white/10 rounded-xl p-4">
              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-pink-300 mb-2">{product.brand}</p>
              <p className="text-2xl font-bold text-white mb-4">${product.price}</p>
              
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reactions */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Quick Reactions</h4>
              <div className="grid grid-cols-4 gap-2">
                {['🔥', '💯', '😍', '👑', '✨', '💖', '🎯', '🚀'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(emoji)}
                    className="text-2xl p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Friends Activity */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Friends Watching</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                  <span className="text-white text-sm">Sarah is watching 👀</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                  <span className="text-white text-sm">Maya loves this! 💖</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">Alex says "Fire!" 🔥</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <button className="w-full bg-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share Look</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnModal;
