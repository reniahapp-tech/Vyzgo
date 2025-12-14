import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: "Como você está se sentindo hoje?",
    options: ["Estressado e ansioso", "Sem energia", "Com insônia", "Apenas buscando paz"]
  },
  {
    id: 2,
    question: "Qual seu principal objetivo agora?",
    options: ["Relaxar profundamente", "Aumentar foco", "Dormir melhor", "Cuidar da pele"]
  },
  {
    id: 3,
    question: "Qual tipo de aroma você prefere?",
    options: ["Floral e doce", "Cítrico e fresco", "Amadeirado", "Herbal e mentolado"]
  }
];

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const { config, addToCart } = useConfig();
  const { quiz, theme } = config;
  
  const [step, setStep] = useState(0); // 0 = intro, 1..3 = questions, 4 = result
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => setStep(1);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Analyze
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(4);
      }, 1500);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: 'quiz-result',
      title: config.hero.title, // In a real app, map logic to products
      price: config.hero.price,
      imageUrl: config.hero.imageUrl,
      quantity: 1
    });
    onClose();
    // Logic to open cart or show success toast handled by context/header
  };

  // Intro Screen
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center animate-slide-up-panel" style={{ backgroundColor: theme.backgroundColor }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
          
          <div className="w-20 h-20 bg-gradient-to-tr from-terracotta to-sage rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg">
            {quiz.emoji}
          </div>
          
          <h2 className="text-2xl font-bold mb-3" style={{ color: theme.textColor }}>{quiz.title}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Responda 3 perguntas rápidas e descubra o produto ideal para elevar sua vibração hoje.</p>
          
          <button 
            onClick={handleStart}
            className="w-full font-bold py-4 rounded-xl2 shadow-md hover:shadow-lg transition-all active:scale-95 text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Sparkles size={18} />
            Começar Quiz
          </button>
        </div>
      </div>
    );
  }

  // Analyzing Screen
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm bg-white rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-terracotta rounded-full animate-spin mb-4"></div>
          <p className="font-medium text-gray-500 animate-pulse">Analisando suas respostas...</p>
        </div>
      </div>
    );
  }

  // Result Screen
  if (step === 4) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden animate-slide-up-panel" style={{ backgroundColor: theme.backgroundColor }}>
          <div className="bg-gradient-to-br from-terracotta to-sage p-6 text-white text-center">
            <Sparkles className="mx-auto mb-2 opacity-80" size={32} />
            <h2 className="text-xl font-bold">Seu Match Perfeito!</h2>
            <p className="text-white/80 text-sm">Baseado no seu perfil</p>
          </div>
          
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <img src={config.hero.imageUrl} className="w-20 h-20 rounded-xl object-cover shadow-md" />
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: theme.textColor }}>{config.hero.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{config.hero.price}</p>
                <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block font-bold">
                  98% Compatível
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 leading-relaxed bg-white/50 p-3 rounded-xl border border-white">
              Este kit contém exatamente os elementos que você precisa para alcançar seus objetivos de bem-estar hoje.
            </p>
            
            <button 
              onClick={handleAddToCart}
              className="w-full font-bold py-3.5 rounded-xl2 shadow-md hover:shadow-lg transition-all active:scale-95 text-white mb-3"
              style={{ backgroundColor: theme.accentColor }}
            >
              Adicionar à Sacola
            </button>
            
            <button 
              onClick={handleReset}
              className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1"
            >
              <RotateCcw size={12} />
              Refazer Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const currentQuestion = QUESTIONS[step - 1];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 animate-slide-up-panel" style={{ backgroundColor: theme.backgroundColor }}>
         {/* Progress */}
         <div className="flex gap-1 mb-6">
           {QUESTIONS.map(q => (
             <div key={q.id} className={`h-1.5 rounded-full flex-1 transition-all ${step >= q.id ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
           ))}
         </div>

         <h3 className="text-xl font-bold mb-6 pr-8" style={{ color: theme.textColor }}>
           {currentQuestion.question}
         </h3>
         
         <div className="space-y-3">
           {currentQuestion.options.map((option, idx) => (
             <button
               key={idx}
               onClick={() => handleAnswer(option)}
               className="w-full text-left p-4 rounded-xl border border-transparent bg-white shadow-sm hover:border-terracotta hover:text-terracotta transition-all group flex items-center justify-between"
             >
               <span className="font-medium text-gray-600 group-hover:text-terracotta text-sm">{option}</span>
               <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-terracotta" />
             </button>
           ))}
         </div>
      </div>
    </div>
  );
};

export default QuizModal;