
import React from 'react';
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    user: "Sarah M.",
    action: "tried on",
    item: "Classic Wool Coat",
    time: "2m ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    reactions: ["❤️", "👍", "✨"]
  },
  {
    id: 2,
    user: "Alex Chen",
    action: "bought",
    item: "Minimalist Blazer",
    time: "5m ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    reactions: ["👏", "🔥"]
  },
  {
    id: 3,
    user: "Maya P.",
    action: "is trying on",
    item: "Elegant Midi Dress",
    time: "now",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    reactions: ["👀", "💖"],
    isLive: true
  },
  {
    id: 4,
    user: "Jordan K.",
    action: "loved",
    item: "Tailored Trousers",
    time: "12m ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    reactions: ["👌"]
  }
];

const SocialFeed = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Friend Activity</h3>
        <Clock className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className="relative">
              <img 
                src={activity.avatar} 
                alt={activity.user}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activity.isLive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action} </span>
                <span className="font-medium">{activity.item}</span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500 text-xs">{activity.time}</span>
                <div className="flex items-center space-x-1">
                  {activity.reactions.map((reaction, index) => (
                    <span key={index} className="text-sm">{reaction}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors text-xs">
                  <Heart className="w-3 h-3" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors text-xs">
                  <MessageCircle className="w-3 h-3" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors text-xs">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
        View All Activity
      </button>
    </div>
  );
};

export default SocialFeed;
