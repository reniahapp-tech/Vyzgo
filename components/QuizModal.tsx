
import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { chatWithShopper, ChatMessage } from '../services/ai';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const { config } = useConfig();
  const { theme } = config;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', text: `Olá! Sou o Personal Shopper da ${config.header.title}. Como posso ajudar você a encontrar o look perfeito hoje?` }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');

    // Add User Message
    const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsTyping(true);

    // Call AI
    const catalogContext = JSON.stringify(config.categories);
    const aiResponse = await chatWithShopper(messages, userMsg, catalogContext);

    setIsTyping(false);
    setMessages([...newHistory, { role: 'model', text: aiResponse }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl animate-fade-in"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight">Personal Shopper</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Online Agora</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                  ${msg.role === 'user' ? 'bg-gray-200' : 'bg-white border border-purple-100 text-purple-600'}`}
              >
                {msg.role === 'user' ? <User size={14} className="text-gray-500" /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ex: Estou procurando um vestido para festa..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2 rounded-full transition-all ${inputValue.trim() ? 'bg-blue-600 text-white shadow-md transform hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">IA pode cometer erros. Verifique as informações.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;