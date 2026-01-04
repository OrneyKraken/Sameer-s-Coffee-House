
import React, { useState } from 'react';
import { getCoffeeRecommendation } from '../services/geminiService';
import { MenuItem } from '../types';

interface RecommenderAIProps {
  onAddToCart: (item: MenuItem) => void;
  menuOverride: MenuItem[];
}

const RecommenderAI: React.FC<RecommenderAIProps> = ({ onAddToCart, menuOverride }) => {
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      // Pass the current menu items to the recommendation engine
      const result = await getCoffeeRecommendation(mood, menuOverride);
      const menuItem = menuOverride.find(i => i.name === result.name);
      if (menuItem) {
        setRecommendation({ ...result, item: menuItem });
      } else {
        // Fallback to the first available item if the AI provides an inexact name
        setRecommendation({ ...result, item: menuOverride[0] });
      }
    } catch (error) {
      console.error("Recommendation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const moods = ["Energized", "Sleepy", "Romantic", "Adventurous", "Focus Mode"];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-amber-50 rounded-[40px] p-8 md:p-12 shadow-inner border border-amber-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Coffee for your Mood</h2>
              <p className="text-stone-600 mb-8">Not sure what to order? Tell our AI how you're feeling and we'll suggest the perfect cup from our live database.</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {moods.map(m => (
                  <button 
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mood === m ? 'bg-amber-800 text-white' : 'bg-white text-stone-600 border border-amber-200 hover:border-amber-800'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="Or type your own vibe..."
                  className="flex-grow px-6 py-3 rounded-full border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button 
                  onClick={handleRecommend}
                  disabled={loading || !mood}
                  className="px-8 py-3 bg-amber-800 text-white rounded-full font-bold hover:bg-amber-900 transition disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Thinking...' : 'Recommend'}
                </button>
              </div>
            </div>

            {recommendation && (
              <div className="flex-1 bg-white p-6 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                    <img src={recommendation.item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-amber-900 font-bold">{recommendation.item.name}</h4>
                    <span className="text-xs text-stone-500 uppercase tracking-widest">Recommended for you</span>
                  </div>
                </div>
                <p className="text-stone-700 text-sm mb-4 leading-relaxed">
                  <span className="font-bold text-amber-800">Why:</span> {recommendation.reason}
                </p>
                <div className="bg-stone-50 p-3 rounded-xl mb-4 border-l-4 border-amber-500">
                  <p className="text-[11px] italic text-stone-600">"Barista Tip: {recommendation.tip}"</p>
                </div>
                <button 
                  onClick={() => onAddToCart(recommendation.item)}
                  className="w-full py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition font-bold text-sm"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommenderAI;
