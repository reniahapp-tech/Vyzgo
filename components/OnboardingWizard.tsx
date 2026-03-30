import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Store, Link, ShoppingBag, ArrowRight, Check, Sparkles, Smartphone, Palette, Type, Globe, Loader2 } from 'lucide-react';
import { StoreService } from '../services/storeService';
import { useAuth } from '../contexts/AuthContext';
import { PRESET_THEMES } from './AdminPanel';

const OnboardingWizard: React.FC = () => {
    const { config, updateConfig, saveStoreToCloud } = useConfig();
    const { user, refreshStoreStatus } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [slugError, setSlugError] = useState('');

    // Local state for the wizard to avoid flickering global config immediately
    const [localConfig, setLocalConfig] = useState({
        title: config.header.title,
        subtitle: config.header.subtitle,
        storeMode: config.storeMode,
        whatsapp: config.whatsapp.phoneNumber,
        themeId: 'natura',
        slug: ''
    });

    const totalSteps = 6; // Adicionamos 1 passo para o Slug

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const checkSlug = async () => {
        if (!localConfig.slug) {
            setSlugError('O endereço da loja é obrigatório.');
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
            setSlugError('Este endereço já está em uso.');
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
            
            // Redireciona para o novo subdomínio se possível, ou apenas limpa
            const hostname = window.location.hostname;
            if (hostname.includes('vyzgo.com')) {
                window.location.href = window.location.origin;
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // Mock Themes for display if we can't import easily yet
    const THEMES_PREVIEW = [
        { id: 'natura', color: '#C27B63', name: 'Natura' },
        { id: 'dark', color: '#121212', name: 'Luxury' },
        { id: 'ocean', color: '#0EA5E9', name: 'Ocean' },
        { id: 'lavender', color: '#9333EA', name: 'Lavanda' },
        { id: 'solar', color: '#C2410C', name: 'Solar' },
        { id: 'slate', color: '#334155', name: 'Minimal' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden relative">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                    <div
                        className="h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                <div className="p-8 md:p-12">

                    {/* STEP 1: WELCOME */}
                    {step === 1 && (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles size={48} className="text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Parabéns! Você é Pro! 🚀</h1>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Agora vamos configurar sua loja profissional em <strong>menos de 2 minutos</strong>.
                                Não se preocupe, é muito fácil.
                            </p>
                            <button
                                onClick={nextStep}
                                className="bg-gray-900 text-white text-lg font-bold py-4 px-12 rounded-full hover:bg-black transition-transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                            >
                                Começar Agora <ArrowRight />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: IDENTITY */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Type className="text-blue-500" /> Qual o nome da sua loja?
                            </h2>
                            <p className="text-gray-500 mb-8">É assim que seus clientes vão te encontrar.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Nome Principal</label>
                                    <input
                                        value={localConfig.title}
                                        onChange={(e) => setLocalConfig({ ...localConfig, title: e.target.value })}
                                        placeholder="Ex: Boutique da Maria"
                                        className="w-full text-2xl font-bold p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Subtítulo (Opcional)</label>
                                    <input
                                        value={localConfig.subtitle}
                                        onChange={(e) => setLocalConfig({ ...localConfig, subtitle: e.target.value })}
                                        placeholder="Ex: O melhor da moda feminina"
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-12">
                                <button onClick={prevStep} className="text-gray-400 hover:text-gray-600 font-bold">Voltar</button>
                                <button
                                    onClick={nextStep}
                                    disabled={!localConfig.title}
                                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SLUG (Subdomain) */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Globe className="text-green-500" /> Escolha seu endereço
                            </h2>
                            <p className="text-gray-500 mb-8">Como os clientes vão acessar sua vitrine.</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-400">vyzgo.com/</span>
                                    <input
                                        value={localConfig.slug}
                                        onChange={(e) => setLocalConfig({ ...localConfig, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                        placeholder="nome-da-sua-loja"
                                        className="flex-1 bg-transparent text-xl font-bold outline-none focus:text-green-600"
                                        autoFocus
                                    />
                                </div>
                                {slugError && <p className="text-xs font-bold text-red-500 ml-2">{slugError}</p>}
                                <p className="text-[10px] text-gray-400 ml-2 uppercase tracking-wider">Use apenas letras, números e hífens.</p>
                            </div>

                            <div className="flex justify-between mt-12">
                                <button onClick={prevStep} className="text-gray-400 hover:text-gray-600 font-bold">Voltar</button>
                                <button
                                    onClick={checkSlug}
                                    disabled={!localConfig.slug || localConfig.slug.length < 3}
                                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    Verificar Disponibilidade
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: MODE */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Store className="text-purple-500" /> Como você quer vender?
                            </h2>
                            <p className="text-gray-500 mb-8">Escolha o modelo que melhor se adapta ao seu negócio.</p>

                            <div className="grid gap-4">
                                <button
                                    onClick={() => setLocalConfig({ ...localConfig, storeMode: 'store' })}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] flex items-start gap-4 ${localConfig.storeMode === 'store' ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-100 hover:border-purple-200'}`}
                                >
                                    <div className={`p-3 rounded-full ${localConfig.storeMode === 'store' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Modo Loja</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Seus clientes montam um carrinho e enviam o pedido completo para o seu WhatsApp.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setLocalConfig({ ...localConfig, storeMode: 'affiliate' })}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] flex items-start gap-4 ${localConfig.storeMode === 'affiliate' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-100 hover:border-blue-200'}`}
                                >
                                    <div className={`p-3 rounded-full ${localConfig.storeMode === 'affiliate' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Link size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Modo Afiliado</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Você exibe produtos, mas o botão de compra leva para outro site (Shopee, Amazon, etc).
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setLocalConfig({ ...localConfig, storeMode: 'mixed' })}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] flex items-start gap-4 ${localConfig.storeMode === 'mixed' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-100 hover:border-orange-200'}`}
                                >
                                    <div className={`p-3 rounded-full ${localConfig.storeMode === 'mixed' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Store size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Híbrido (Recomendado)</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            O melhor dos dois mundos. Você pode ter produtos próprios e links de afiliado juntos.
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={prevStep} className="text-gray-400 hover:text-gray-600 font-bold">Voltar</button>
                                <button
                                    onClick={nextStep}
                                    className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-all"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: THEME */}
                    {step === 5 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Palette className="text-pink-500" /> Escolha seu estilo
                            </h2>
                            <p className="text-gray-500 mb-8">Selecione uma cor base para sua loja.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {THEMES_PREVIEW.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setLocalConfig({ ...localConfig, themeId: theme.id });
                                            // In reality we would call applyTheme here to preview
                                            const realTheme = PRESET_THEMES.find(t => t.id === theme.id);
                                            if (realTheme) {
                                                updateConfig({ ...config, theme: { ...config.theme, ...realTheme.config.theme } });
                                            }
                                        }}
                                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${localConfig.themeId === theme.id ? 'border-gray-900 bg-gray-50 scale-105' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full shadow-md" style={{ backgroundColor: theme.color }}></div>
                                        <span className="font-bold text-sm text-gray-700">{theme.name}</span>
                                        {localConfig.themeId === theme.id && (
                                            <div className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-1">
                                                <Check size={12} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between mt-12">
                                <button onClick={prevStep} className="text-gray-400 hover:text-gray-600 font-bold">Voltar</button>
                                <button
                                    onClick={nextStep}
                                    className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-all"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: WHATSAPP */}
                    {step === 6 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Smartphone className="text-green-500" /> Seu WhatsApp
                            </h2>
                            <p className="text-gray-500 mb-8">Para onde devemos enviar os pedidos?</p>

                            <div className="mb-8">
                                <div className="relative">
                                    <div className="absolute left-4 top-4 text-gray-400 font-bold">+55</div>
                                    <input
                                        value={localConfig.whatsapp}
                                        onChange={(e) => setLocalConfig({ ...localConfig, whatsapp: e.target.value.replace(/\D/g, '') })}
                                        placeholder="11999999999"
                                        type="tel"
                                        className="w-full pl-14 p-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition-all tracking-widest"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 ml-2">Digite apenas números com DDD.</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-8 flex gap-3">
                                <Check className="text-green-600 shrink-0" size={20} />
                                <p className="text-sm text-green-800">
                                    Tudo pronto! Ao clicar em finalizar, sua loja VyzGo estará configurada e pronta para receber produtos.
                                </p>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={prevStep} className="text-gray-400 hover:text-gray-600 font-bold">Voltar</button>
                                <button
                                    onClick={handleFinish}
                                    disabled={localConfig.whatsapp.length < 10 || isSaving}
                                    className="bg-green-600 text-white font-bold py-4 px-10 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Finalizar e Criar Loja 🎉'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
