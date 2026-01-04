
import React, { useState, useRef, useEffect } from 'react';
import { baristaChat } from '../services/geminiService';
import { ChatMessage, MenuItem } from '../types';

// Define props to match what is being passed from App.tsx
interface BaristaAIProps {
  menuItems: MenuItem[];
}

const BaristaAI: React.FC<BaristaAIProps> = ({ menuItems }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! Welcome to Sameer\'s Coffee Shop. I\'m your digital barista. Ask me anything about our coffee, brewing methods, or for a recommendation based on your mood!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Pass menuItems to the baristaChat service to ensure the AI has the current menu context
      const response = await baristaChat(messages, userMsg, menuItems);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting to the roast master. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 h-[calc(100vh-4rem)] flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-amber-900 mb-2">Barista AI</h2>
        <p className="text-stone-500 italic">"Good coffee is a conversation between the bean and the water."</p>
      </div>

      <div className="flex-grow bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-stone-200">
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-4 bg-stone-50"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                m.role === 'user' 
                  ? 'bg-amber-800 text-white' 
                  : 'bg-white text-stone-800 border border-stone-100'
              }`}>
                {m.role === 'model' && (
                  <div className="flex items-center space-x-2 mb-2 text-amber-700 font-bold text-xs uppercase tracking-widest">
                    <i className="fas fa-coffee"></i>
                    <span>Sameer's Barista</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-5 py-3 border border-stone-100 flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-stone-100">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our roasting process or for a brew tip..."
              className="w-full pl-6 pr-16 py-4 bg-stone-100 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-3 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition disabled:opacity-50"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaristaAI;
