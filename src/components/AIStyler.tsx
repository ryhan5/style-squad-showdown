
import React, { useState } from 'react';
import { Sparkles, Wand2, TrendingUp, User, Target } from 'lucide-react';

const AIStyler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: "Perfect Match",
      confidence: 95,
      reason: "Based on your style preferences and recent activity",
      item: "Classic Trench Coat"
    },
    {
      id: 2,
      type: "Trending Now",
      confidence: 88,
      reason: "Popular among users with similar taste",
      item: "Minimalist Silk Blouse"
    },
    {
      id: 3,
      type: "Complete the Look",
      confidence: 92,
      reason: "Perfect complement to your recent selections",
      item: "Leather Ankle Boots"
    }
  ]);

  const analyzeLook = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Stylist</h3>
        </div>
        <button 
          onClick={analyzeLook}
          disabled={isAnalyzing}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm"
        >
          <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {suggestion.type === 'Perfect Match' && <Target className="w-4 h-4 text-green-600" />}
                {suggestion.type === 'Trending Now' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                {suggestion.type === 'Complete the Look' && <Sparkles className="w-4 h-4 text-purple-600" />}
                <span className="text-gray-900 font-medium text-sm">{suggestion.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-800 rounded-full transition-all duration-500"
                    style={{ width: `${suggestion.confidence}%` }}
                  />
                </div>
                <span className="text-gray-600 text-xs">{suggestion.confidence}%</span>
              </div>
            </div>
            
            <h4 className="text-gray-900 font-semibold mb-1">{suggestion.item}</h4>
            <p className="text-gray-600 text-sm mb-3">{suggestion.reason}</p>
            
            <button className="w-full bg-gray-100 text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              View Recommendation
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-gray-700" />
          <span className="text-gray-900 font-medium text-sm">Style Battle Mode</span>
        </div>
        <p className="text-gray-600 text-sm mb-3">Let our AI stylists compete to find your perfect look!</p>
        <button className="w-full bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          Start Style Battle
        </button>
      </div>
    </div>
  );
};

export default AIStyler;
