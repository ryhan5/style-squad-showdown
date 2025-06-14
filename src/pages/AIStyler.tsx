
import React, { useState } from 'react';
import { Sparkles, Wand2, TrendingUp, Target, User, Camera, Upload, Palette, Zap, Heart, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIStyler = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [uploadedImage, setUploadedImage] = useState(null);

  const styleCategories = [
    { id: 'minimalist', name: 'Minimalist', icon: User },
    { id: 'bohemian', name: 'Bohemian', icon: Palette },
    { id: 'classic', name: 'Classic', icon: Target },
    { id: 'trendy', name: 'Trendy', icon: TrendingUp },
    { id: 'edgy', name: 'Edgy', icon: Zap },
    { id: 'romantic', name: 'Romantic', icon: Heart }
  ];

  const recommendations = [
    {
      id: 1,
      type: "Perfect Match",
      confidence: 95,
      reason: "Based on your style preferences and body type",
      item: "Tailored Blazer",
      price: "$189",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      type: "Trending Now",
      confidence: 88,
      reason: "Popular among users with similar taste",
      item: "Silk Midi Dress",
      price: "$145",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      type: "Complete the Look",
      confidence: 92,
      reason: "Perfect complement to your recent selections",
      item: "Leather Ankle Boots",
      price: "$220",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop"
    },
    {
      id: 4,
      type: "Color Match",
      confidence: 87,
      reason: "Matches your preferred color palette",
      item: "Cashmere Sweater",
      price: "$165",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop"
    }
  ];

  const styleProfile = {
    bodyType: "Hourglass",
    preferredColors: ["Navy", "Cream", "Burgundy", "Forest Green"],
    stylePersonality: "Classic with Modern Touches",
    budget: "$100-300",
    occasions: ["Professional", "Casual", "Date Night"]
  };

  const analyzeLook = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Shop</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI Personal Stylist</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Style Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Look</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Uploaded" className="w-full h-40 object-cover rounded-lg mb-4" />
                ) : (
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </label>
                <p className="text-gray-500 text-sm mt-2">Get style analysis from your outfit photos</p>
              </div>
            </div>

            {/* Style Categories */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Preferences</h3>
              <div className="grid grid-cols-2 gap-3">
                {styleCategories.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedStyle === style.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <style.icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Profile */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Style Profile</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Body Type:</span>
                  <p className="text-gray-900">{styleProfile.bodyType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Style Personality:</span>
                  <p className="text-gray-900">{styleProfile.stylePersonality}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Budget Range:</span>
                  <p className="text-gray-900">{styleProfile.budget}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Preferred Colors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {styleProfile.preferredColors.map((color) => (
                      <span
                        key={color}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Action Bar */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'recommendations'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Recommendations
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'analysis'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Style Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('outfits')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'outfits'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Complete Outfits
                  </button>
                </div>
                <button
                  onClick={analyzeLook}
                  disabled={isAnalyzing}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Get New Recommendations'}</span>
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            {activeTab === 'recommendations' && (
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="aspect-w-3 aspect-h-4">
                      <img
                        src={recommendation.image}
                        alt={recommendation.item}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {recommendation.type === 'Perfect Match' && <Target className="w-4 h-4 text-green-600" />}
                          {recommendation.type === 'Trending Now' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                          {recommendation.type === 'Complete the Look' && <Sparkles className="w-4 h-4 text-purple-600" />}
                          {recommendation.type === 'Color Match' && <Palette className="w-4 h-4 text-orange-600" />}
                          <span className="text-gray-900 font-medium text-sm">{recommendation.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-800 rounded-full transition-all duration-500"
                              style={{ width: `${recommendation.confidence}%` }}
                            />
                          </div>
                          <span className="text-gray-600 text-xs">{recommendation.confidence}%</span>
                        </div>
                      </div>
                      
                      <h4 className="text-gray-900 font-semibold mb-1">{recommendation.item}</h4>
                      <p className="text-gray-600 text-sm mb-2">{recommendation.reason}</p>
                      <p className="text-lg font-semibold text-gray-900 mb-4">{recommendation.price}</p>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                          Try On
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Style Analysis */}
            {activeTab === 'analysis' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Style Analysis</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Body Analysis</h4>
                      <p className="text-gray-600 text-sm">Personalized fit recommendations based on your measurements</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Palette className="w-8 h-8 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Color Analysis</h4>
                      <p className="text-gray-600 text-sm">Colors that complement your skin tone and style</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-8 h-8 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Trend Matching</h4>
                      <p className="text-gray-600 text-sm">Current trends aligned with your personal style</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Your Style DNA</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Primary Style:</span>
                        <span className="text-gray-900 ml-2">Classic Professional</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Secondary Style:</span>
                        <span className="text-gray-900 ml-2">Modern Minimalist</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Color Season:</span>
                        <span className="text-gray-900 ml-2">Deep Autumn</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Style Confidence:</span>
                        <span className="text-gray-900 ml-2">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Outfits */}
            {activeTab === 'outfits' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Outfit Suggestions</h3>
                  <p className="text-gray-600 mb-6">Curated head-to-toe looks based on your style profile</p>
                  
                  <div className="grid gap-6">
                    {['Work Day Chic', 'Weekend Casual', 'Date Night Elegant'].map((outfit, index) => (
                      <div key={outfit} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">{outfit}</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Item {item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-semibold text-gray-900">Total: $485</span>
                          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                            Try Complete Look
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStyler;
