
import React from 'react';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';

const activities = [
  {
    id: 1,
    user: "Sarah M.",
    action: "tried on",
    item: "Neon Dreams Crop Top",
    time: "2m ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    reactions: ["🔥", "💯", "😍"]
  },
  {
    id: 2,
    user: "Alex Chen",
    action: "bought",
    item: "LED Accent Jacket",
    time: "5m ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    reactions: ["👑", "✨"]
  },
  {
    id: 3,
    user: "Maya P.",
    action: "is trying on",
    item: "Holographic Mini Skirt",
    time: "now",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    reactions: ["👀", "💖"],
    isLive: true
  },
  {
    id: 4,
    user: "Jordan K.",
    action: "loved",
    item: "Cosmic Print Leggings",
    time: "12m ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    reactions: ["💯"]
  }
];

const SocialFeed = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Friend Activity</h3>
        <Sparkles className="w-5 h-5 text-pink-300" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="relative">
              <img 
                src={activity.avatar} 
                alt={activity.user}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activity.isLive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm">
                <span className="font-semibold">{activity.user}</span>
                <span className="text-white/70"> {activity.action} </span>
                <span className="font-medium">{activity.item}</span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/50 text-xs">{activity.time}</span>
                <div className="flex items-center space-x-1">
                  {activity.reactions.map((reaction, index) => (
                    <span key={index} className="text-sm">{reaction}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center space-x-1 text-white/70 hover:text-pink-300 transition-colors text-xs">
                  <Heart className="w-3 h-3" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-white/70 hover:text-pink-300 transition-colors text-xs">
                  <MessageCircle className="w-3 h-3" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-white/70 hover:text-pink-300 transition-colors text-xs">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-pink-300 hover:text-pink-200 transition-colors text-sm">
        View All Activity
      </button>
    </div>
  );
};

export default SocialFeed;
