import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { 
    Store, Link as LinkIcon, ShoppingBag, ArrowRight, Check, Sparkles, 
    Smartphone, Palette, Type, Globe, Loader2, ChevronRight, 
    Zap, Star, ShieldCheck, CreditCard
} from 'lucide-react';
import { StoreService } from '../services/storeService';
import { useAuth } from '../contexts/AuthContext';
import { PRESET_THEMES } from './AdminPanel';

const OnboardingWizard: React.FC = () => {
    const { config, updateConfig, addToast } = useConfig();
    const { user, refreshStoreStatus } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [slugError, setSlugError] = useState('');

    const [localConfig, setLocalConfig] = useState({
        title: config.header.title,
        subtitle: config.header.subtitle,
        storeMode: 'store' as 'store' | 'mixed' | 'affiliate',
        whatsapp: config.whatsapp.phoneNumber,
        themeId: 'natura',
        slug: ''
    });

    const totalSteps = 6;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const checkSlug = async () => {
        if (!localConfig.slug) {
            setSlugError('Endereço obrigatório.');
            return;
        }
        if (localConfig.slug.length < 3) {
            setSlugError('Mínimo 3 caracteres.');
            return;
        }
        const isAvailable = await StoreService.isSlugAvailable(localConfig.slug);
        if (isAvailable) {
            setSlugError('');
            nextStep();
        } else {
            setSlugError('Indisponível.');
        }
    };

    const handleFinish = async () => {
        if (!user) return;
        setIsSaving(true);
        const selectedTheme = PRESET_THEMES.find(t => t.id === localConfig.themeId);

        const newFullConfig = {
            ...config,
            header: { ...config.header, title: localConfig.title, subtitle: localConfig.subtitle },
            storeMode: localConfig.storeMode,
            whatsapp: { ...config.whatsapp, phoneNumber: localConfig.whatsapp },
            ...(selectedTheme ? {
                theme: { ...config.theme, ...selectedTheme.config.theme },
                quiz: { ...config.quiz, bgColor: selectedTheme.config.quiz.bgColor }
            } : {})
        };

        try {
            await StoreService.saveStore({
                owner_id: user.id,
                slug: localConfig.slug.toLowerCase().trim(),
                config: newFullConfig,
                is_active: true
            });
            
            await refreshStoreStatus();
            updateConfig(newFullConfig);
            
            // Sucesso!
            addToast('Vitrine publicada com sucesso! ✨', 'success');
            navigate('/');
        } catch (err: any) {
            console.error(err);
            // Captura o código de erro do Supabase ou mensagem genérica
            const errMsg = err.message || (err.code === '23505' ? 'Este endereço já está sendo usado.' : 'Erro ao salvar loja.');
            const errCode = err.code ? `[${err.code}]` : '';
            addToast(`Falha no Cadastro ${errCode}: ${errMsg}`, 'error');
            
            // Se o erro for no slug, volta para o passo 3
            if (err.code === '23505' || errMsg.includes('slug')) {
                setStep(3);
                setSlugError('Este endereço já está em uso.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const THEMES_PREVIEW = [
        { id: 'natura', color: '#C27B63', name: 'Natura' },
        { id: 'dark', color: '#1A1A1A', name: 'Elite Dark' },
        { id: 'ocean', color: '#0EA5E9', name: 'Ocean' },
        { id: 'lavender', color: '#9333EA', name: 'Lavanda' },
        { id: 'solar', color: '#C2410C', name: 'Solar' },
        { id: 'slate', color: '#334155', name: 'Minimale' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Inter',sans-serif]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .text-gradient {
                    background: linear-gradient(to bottom right, #fff, #6366f1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .animate-slide-up {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Passo {step} de {totalSteps}</span>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Configuração de Vitrine Elite</h3>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div key={i} className={`h-1 w-6 rounded-full transition-all duration-300 ${i + 1 <= step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="p-10 md:p-14">

                        {/* STEP 1: WELCOME */}
                        {step === 1 && (
                            <div className="text-center animate-slide-up">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-inner">
                                    <Sparkles size={40} className="text-indigo-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic leading-[1.1]">
                                    Sua jornada <br />
                                    <span className="text-gradient">Começa aqui.</span>
                                </h1>
                                <p className="text-gray-400 text-lg mb-12 font-medium leading-relaxed max-w-md mx-auto">
                                    Vamos transformar seu negócio em uma vitrine virtual irresistível. Prepare-se para a experiência máxima de venda.
                                </p>
                                <button
                                    onClick={nextStep}
                                    className="w-full py-5 bg-white text-black text-lg font-black rounded-3xl hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 uppercase tracking-wider"
                                >
                                    Começar Configuração <ChevronRight size={20} />
                                </button>
                                <div className="mt-8 flex justify-center gap-6 opacity-30">
                                   <Zap size={16} /> <Star size={16} /> <ShieldCheck size={16} />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: IDENTITY */}
                        {step === 2 && (
                            <div className="animate-slide-up">
                                <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic flex items-center gap-3">
                                    <Type className="text-indigo-400" /> Nome da Vitrine
                                </h2>
                                <p className="text-gray-400 mb-10 font-medium">Como o mundo conhecerá a sua marca?</p>

                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-[0.2em] ml-1">Assinatura Principal</label>
                                        <input
                                            value={localConfig.title}
                                            onChange={(e) => setLocalConfig({ ...localConfig, title: e.target.value })}
                                            placeholder="Ex: Boutique Elite"
                                            className="w-full text-2xl font-black p-6 bg-white/5 border border-white/10 rounded-3xl focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-[0.2em] ml-1">Slogan Curto</label>
                                        <input
                                            value={localConfig.subtitle}
                                            onChange={(e) => setLocalConfig({ ...localConfig, subtitle: e.target.value })}
                                            placeholder="Ex: Exclusividade em cada detalhe"
                                            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 outline-none transition-all placeholder:text-white/10 text-gray-300 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-12">
                                    <button onClick={prevStep} className="px-8 py-5 text-gray-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Voltar</button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!localConfig.title}
                                        className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-500/10 uppercase tracking-widest text-sm"
                                    >
                                        Próximo Passo
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SLUG */}
                        {step === 3 && (
                            <div className="animate-slide-up">
                                <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic flex items-center gap-3">
                                    <Globe className="text-indigo-400" /> Seu Domínio
                                </h2>
                                <p className="text-gray-400 mb-10 font-medium">O endereço digital da sua nova casa.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-[32px] group focus-within:border-indigo-500 transition-all">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">vyzgo.com/</span>
                                        <input
                                            value={localConfig.slug}
                                            onChange={(e) => setLocalConfig({ ...localConfig, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                            placeholder="minhaloja"
                                            className="flex-1 bg-transparent text-xl font-black outline-none placeholder:text-white/5"
                                            autoFocus
                                        />
                                    </div>
                                    {slugError && <p className="text-xs font-bold text-red-500 ml-4 animate-pulse">{slugError}</p>}
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Min. 3 caracteres • Apenas letras e números</p>
                                </div>

                                <div className="flex gap-4 mt-12">
                                    <button onClick={prevStep} className="px-8 py-5 text-gray-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">Voltar</button>
                                    <button
                                        onClick={checkSlug}
                                        disabled={!localConfig.slug || localConfig.slug.length < 3}
                                        className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg shadow-indigo-500/10 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                    >
                                        Verificar Disponibilidade <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: MODE */}
                        {step === 4 && (
                            <div className="animate-slide-up">
                                <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase italic flex items-center gap-3">
                                    <Zap className="text-indigo-400" /> Modelo de Venda
                                </h2>
                                <p className="text-gray-400 mb-8 font-medium">Escolha como a magia vai acontecer.</p>

                                <div className="grid gap-4">
                                    {[
                                        { id: 'mixed', icon: Store, title: 'Híbrido Pro', desc: 'Produtos próprios e links de afiliado. Máxima flexibilidade.', color: 'indigo' },
                                        { id: 'store', icon: ShoppingBag, title: 'Loja Direta', desc: 'Foco total em vendas pelo WhatsApp com carrinho estruturado.', color: 'purple' },
                                        { id: 'affiliate', icon: LinkIcon, title: 'Afiliado Elite', desc: 'Curadoria de produtos com links externos (Shopee, Amazon).', color: 'blue' }
                                    ].map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setLocalConfig({ ...localConfig, storeMode: mode.id as any })}
                                            className={`p-6 rounded-[32px] border-2 text-left transition-all relative overflow-hidden group ${localConfig.storeMode === mode.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="flex items-start gap-5 relative z-10">
                                                <div className={`p-4 rounded-3xl ${localConfig.storeMode === mode.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                                    <mode.icon size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl italic uppercase tracking-tight">{mode.title}</h3>
                                                    <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed">{mode.desc}</p>
                                                </div>
                                            </div>
                                            {localConfig.storeMode === mode.id && <div className="absolute top-4 right-4 text-indigo-400"><Check size={20} /></div>}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-10">
                                    <button onClick={prevStep} className="px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white">Voltar</button>
                                    <button onClick={nextStep} className="px-10 py-5 bg-white text-black font-black rounded-[25px] hover:bg-gray-200 transition-all uppercase tracking-widest text-sm">Próximo</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: THEME */}
                        {step === 5 && (
                            <div className="animate-slide-up text-center">
                                <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase italic inline-flex items-center gap-3">
                                    <Palette className="text-indigo-400" /> Identidade Visual
                                </h2>
                                <p className="text-gray-400 mb-10 font-medium">A cor da sua marca transmite autoridade.</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {THEMES_PREVIEW.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setLocalConfig({ ...localConfig, themeId: theme.id })}
                                            className={`group relative p-6 rounded-[40px] transition-all flex flex-col items-center gap-4 ${localConfig.themeId === theme.id ? 'bg-white/10 shadow-2xl scale-105 border border-white/20' : 'hover:bg-white/5'}`}
                                        >
                                            <div 
                                                className="w-14 h-14 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-white/20 transition-transform group-hover:rotate-12" 
                                                style={{ backgroundColor: theme.color }}
                                            ></div>
                                            <span className="font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{theme.name}</span>
                                            {localConfig.themeId === theme.id && (
                                                <div className="absolute top-2 right-2 text-indigo-400 animate-pulse">
                                                    <Star size={12} fill="currentColor" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-14">
                                    <button onClick={prevStep} className="px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white">Voltar</button>
                                    <button onClick={nextStep} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm shadow-xl shadow-indigo-900/40">Continuar</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 6: WHATSAPP */}
                        {step === 6 && (
                            <div className="animate-slide-up">
                                <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase italic flex items-center gap-3">
                                    <Smartphone className="text-indigo-400" /> Conexão Direta
                                </h2>
                                <p className="text-gray-400 mb-10 font-medium">Onde você vai receber os pedidos e lucrar?</p>

                                <div className="mb-10">
                                    <div className="relative group">
                                        <div className="absolute left-6 top-6 text-indigo-400 font-black text-lg">+55</div>
                                        <input
                                            value={localConfig.whatsapp}
                                            onChange={(e) => setLocalConfig({ ...localConfig, whatsapp: e.target.value.replace(/\D/g, '') })}
                                            placeholder="11999999999"
                                            type="tel"
                                            className="w-full pl-16 p-6 text-2xl font-black bg-white/5 border border-white/10 rounded-[32px] focus:border-indigo-500 outline-none transition-all tracking-[0.2em]"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-4 ml-6">Número com DDD (Apenas números)</p>
                                </div>

                                <div className="bg-indigo-950/30 p-6 rounded-[28px] border border-indigo-500/20 mb-12 flex gap-4">
                                    <ShieldCheck className="text-indigo-400 shrink-0" size={24} />
                                    <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                        Assinatura pronta para ativação. Ao finalizar, sua vitrine será implantada instantaneamente em nossos servidores de alto desempenho.
                                    </p>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <button onClick={prevStep} className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-white">Voltar</button>
                                    <button
                                        onClick={handleFinish}
                                        disabled={isSaving || (localConfig.storeMode !== 'affiliate' && localConfig.whatsapp.length < 10)}
                                        className="flex-1 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-[32px] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 transition-all shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" /> : <>Finalizar & Publicar Vitrine <ArrowRight size={20} /></>}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                        <CreditCard size={12} /> Pagamento Seguro via Asaas • VyzGo Tech Elite
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
