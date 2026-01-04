
import React from 'react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000" 
          alt="Coffee shop background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Elevate Your <br />
            <span className="text-amber-500">Coffee Ritual</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-stone-200 font-light">
            Expertly sourced beans, precision brewing, and a warm atmosphere await you at Sameer's. Experience the art of the perfect pour.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold transition shadow-lg flex items-center justify-center"
            >
              Order Online <i className="fas fa-arrow-right ml-2"></i>
            </button>
            <button 
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full font-bold transition border border-white/30"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Coffee Steam Decoration */}
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none hidden md:block">
        <i className="fas fa-mug-hot text-[300px] text-white"></i>
      </div>
    </section>
  );
};

export default Hero;
