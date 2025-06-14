
import React, { useState } from 'react';
import { Sparkles, Wand2, TrendingUp, User } from 'lucide-react';

const AIStyler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: "Perfect Match",
      confidence: 95,
      reason: "Based on your love for bold colors and trendy cuts",
      item: "Neon Dreams Crop Top"
    },
    {
      id: 2,
      type: "Trending Now",
      confidence: 88,
      reason: "Similar items are flying off virtual shelves",
      item: "Holographic Mini Skirt"
    },
    {
      id: 3,
      type: "Complete the Look",
      confidence: 92,
      reason: "Perfect complement to your recent try-ons",
      item: "Prismatic Platform Boots"
    }
  ]);

  const analyzeLook = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Could add new suggestions here
    }, 2000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Stylist</h3>
        </div>
        <button 
          onClick={analyzeLook}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {suggestion.type === 'Perfect Match' && <User className="w-4 h-4 text-green-400" />}
                {suggestion.type === 'Trending Now' && <TrendingUp className="w-4 h-4 text-orange-400" />}
                {suggestion.type === 'Complete the Look' && <Sparkles className="w-4 h-4 text-purple-400" />}
                <span className="text-white font-medium text-sm">{suggestion.type}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${suggestion.confidence}%` }}
                  />
                </div>
                <span className="text-white/70 text-xs">{suggestion.confidence}%</span>
              </div>
            </div>
            
            <h4 className="text-white font-semibold mb-1">{suggestion.item}</h4>
            <p className="text-white/70 text-sm">{suggestion.reason}</p>
            
            <button className="w-full mt-3 bg-white/20 text-white py-2 px-3 rounded-lg hover:bg-white/30 transition-colors text-sm">
              View Recommendation
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-white font-medium text-sm">Style Battle Mode</span>
        </div>
        <p className="text-white/70 text-sm mb-3">Let our AI stylists compete to find your perfect look!</p>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium">
          Start Style Battle
        </button>
      </div>
    </div>
  );
};

export default AIStyler;
