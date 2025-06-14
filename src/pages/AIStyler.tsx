
import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, User, Camera, Palette, Zap, Heart, Share2, ArrowLeft, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { VirtualTryOn } from '@/components/VirtualTryOn';

type StyleCategory = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Recommendation = {
  id: number;
  type: string;
  confidence: number;
  reason: string;
  item: string;
  price: string;
  image: string;
};

type StyleProfile = {
  bodyType: string;
  preferredColors: string[];
  stylePersonality: string;
  budget: string;
  occasions: string[];
};

const AIStyler: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'virtual-tryon' | 'recommendations'>('virtual-tryon');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const styleCategories: StyleCategory[] = [
    { id: 'minimalist', name: 'Minimalist', icon: User },
    { id: 'bohemian', name: 'Bohemian', icon: Palette },
    { id: 'classic', name: 'Classic', icon: Target },
    { id: 'trendy', name: 'Trendy', icon: TrendingUp },
    { id: 'edgy', name: 'Edgy', icon: Zap },
    { id: 'romantic', name: 'Romantic', icon: Heart }
  ];

  const recommendations: Recommendation[] = [
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

  const styleProfile: StyleProfile = {
    bodyType: "Hourglass",
    preferredColors: ["Navy", "Cream", "Burgundy", "Forest Green"],
    stylePersonality: "Classic with Modern Touches",
    budget: "$100-300",
    occasions: ["Professional", "Casual", "Date Night"]
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-lg font-medium">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">AI Stylist</h1>
          <div className="w-8"></div> {/* For spacing */}
        </div>

  
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs 
          value={activeTab} 
          onValueChange={(value: 'virtual-tryon' | 'recommendations') => setActiveTab(value)} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="virtual-tryon" className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Virtual Try-On
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Style Recommendations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="virtual-tryon" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Virtual Try-On</h2>
              <p className="text-gray-600 mb-6">
                Upload your photo and a garment to see how it looks on you using our AI-powered virtual try-on technology.
              </p>
              <VirtualTryOn />
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Style Recommendations</h2>
            
            {!uploadedImage ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Upload a photo to get started</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload your photo to receive personalized style recommendations.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => setActiveTab('virtual-tryon')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AIStyler;
