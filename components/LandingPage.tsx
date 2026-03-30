import React, { useState } from 'react';
import {
    Sparkles, Layers, MessageCircle, Link as LinkIcon, Smartphone, Zap,
    CheckCircle, ArrowRight, Menu, X, Palette, Globe, ChevronDown,
    Instagram, ShoppingBag, BarChart, Map, Share2, ShieldCheck,
    CreditCard, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 overflow-x-hidden font-['Inter',sans-serif]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
                
                body {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
            
            {/* 1. NAVIGATION - Premium Glassmorphism */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center transition-transform hover:scale-105">
                        <img src="/logo-main.png" alt="VyzGo" className="h-10 md:h-14 w-auto object-contain brightness-0 invert" />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#features" className="hover:text-purple-400 transition-colors">Recursos</a>
                        <a href="#integrations" className="hover:text-purple-400 transition-colors">Integração</a>
                        <a href="#pricing" className="hover:text-purple-400 transition-colors">Planos</a>
                        <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
                        <a href="https://app.vyzgo.com/login" className="hover:text-purple-400 transition-colors">Acessar Vitrine</a>
                    </div>

                    {/* CTA Desktop */}
                    <a href="https://app.vyzgo.com" className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-black rounded-full text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-wider">
                        Começar Agora
                    </a>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-neutral-900 border-b border-zinc-800 p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
                        <a href="#features" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Recursos</a>
                        <a href="#integrations" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Integração</a>
                        <a href="#pricing" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Planos</a>
                        <a href="https://app.vyzgo.com/login" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Acessar Vitrine</a>
                        <a href="https://app.vyzgo.com" className="mt-4 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-center" onClick={() => setIsMenuOpen(false)}>
                            Começar Agora
                        </a>
                    </div>
                )}
            </nav>

            {/* 2. HERO SECTION - Side-by-side */}
            <section className="pt-32 pb-20 container mx-auto px-4 relative">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side: Content */}
                    <div className="lg:w-3/5 text-left lg:pr-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Zap size={14} fill="currentColor" />
                            Tecnologia 2.0
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.05] uppercase italic">
                            Transforme sua <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
                                Bio em Lucro.
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-2xl">
                            A vitrine inteligente que converte seguidores em clientes. Produtos físicos e digitais em um link profissional e integrado ao WhatsApp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
                            <a href="https://app.vyzgo.com" className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] font-black text-lg transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 group">
                                <Zap size={22} className="group-hover:animate-pulse" fill="currentColor" />
                                CRIAR MINHA VITRINE
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">🛡️ 100% SEGURO</div>
                            <div className="flex items-center gap-2">💳 ZERO TAXAS</div>
                            <div className="flex items-center gap-2">👥 +10 MIL LOJISTAS</div>
                        </div>
                    </div>

                    {/* Right Side: Proportional Image */}
                    <div className="lg:w-2/5 relative">
                        <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                        <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-3xl transform border-indigo-500/20 group hover:scale-[1.01] transition-transform duration-700 max-w-[400px] mx-auto lg:ml-auto">
                            <img 
                                src="/hero_lifestyle.png" 
                                alt="Empreendedor VyzGo" 
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.7 TRANSFORMATION SECTION (Before vs After) */}
            <section className="py-24 md:py-32 bg-black w-full border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">A Transformação Digital.</h2>
                        <p className="text-gray-400 text-lg md:text-xl font-medium">O que muda quando você profissionaliza seu link na bio.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Before */}
                        <div className="p-8 md:p-12 bg-neutral-900/50 rounded-[40px] border border-red-500/10 relative overflow-hidden group">
                            <div className="absolute top-6 right-6 px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">Como é hoje</div>
                            <h3 className="text-2xl font-black mb-6 uppercase text-gray-300">Link Comum</h3>
                            <ul className="space-y-4 text-gray-500 font-medium">
                                <li className="flex items-center gap-3">❌ Botões cinzas sem graça</li>
                                <li className="flex items-center gap-3">❌ Cliente se perde no site</li>
                                <li className="flex items-center gap-3">❌ Pedidos bagunçados no Zap</li>
                                <li className="flex items-center gap-3">❌ Visual amador</li>
                            </ul>
                        </div>

                        {/* After (VyzGo) */}
                        <div className="p-8 md:p-12 bg-indigo-600 rounded-[40px] shadow-2xl shadow-indigo-500/20 relative overflow-hidden group transform hover:scale-[1.02] transition-all">
                            <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Com VyzGo</div>
                            <h3 className="text-2xl font-black mb-6 uppercase text-white">Sua Vitrine Elite</h3>
                            <ul className="space-y-4 text-indigo-100 font-medium">
                                <li className="flex items-center gap-3">✅ Vitrine visual e atraente</li>
                                <li className="flex items-center gap-3">✅ Navegação intuitiva (Shopping)</li>
                                <li className="flex items-center gap-3">✅ Pedidos prontos e organizados</li>
                                <li className="flex items-center gap-3">✅ Marca forte e confiança</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. VSL / DEMO MOCKUP - More Realistic & Explanatory */}
            <section id="demo" className="py-32 bg-neutral-900 border-y border-white/5 w-full relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto bg-black rounded-[48px] border border-zinc-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row group">
                        <div className="p-10 md:p-16 lg:w-1/2 flex flex-col justify-center">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter italic uppercase">Venda muito <br/> sem complicação.</h2>
                            
                            <p className="text-gray-400 text-xl mb-10 leading-relaxed font-medium">
                                Chega de links que só mostram botões. O VyzGo entrega uma vitrine de verdade, onde seu cliente navega pelos produtos como se estivesse em um shopping, mas com a simplicidade de uma mensagem no Zap.
                            </p>

                            <ul className="space-y-10">
                                <li className="flex gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 border border-green-500/20">
                                        <MessageCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl mb-2 italic uppercase">Pedidos Diretos no WhatsApp</h3>
                                        <p className="text-gray-500 text-lg leading-relaxed">Seu cliente escolhe o tamanho, a cor e a quantidade. Quando ele clica em fechar, você recebe uma lista organizada com tudo pronto para veder.</p>
                                    </div>
                                </li>
                                <li className="flex gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                                        <Layers size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl mb-2 italic uppercase">Organize tudo por categorias</h3>
                                        <p className="text-gray-500 text-lg leading-relaxed">Roupas, eletrônicos ou serviços. Crie categorias ilimitadas para facilitar a vida do seu cliente e aumentar seu lucro.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Visual Side (Mockup with Realistic Asset) */}
                        <div className="lg:w-1/2 bg-zinc-900 relative min-h-[600px] overflow-hidden">
                            <img 
                                src="/person_using_phone.png" 
                                alt="Uso na prática" 
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                            <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10">
                                <p className="text-white font-black text-xl italic uppercase mb-2">Simplicidade real</p>
                                <p className="text-gray-400 font-medium">Lojistas do Brasil inteiro estão usando o VyzGo para profissionalizar suas vendas pelo Instagram.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.5 SUCCESS STORY SECTION - Realism & Trust */}
            <section className="py-24 bg-black w-full overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter italic uppercase">Feito por brasileiros <br/> para brasileiros.</h2>
                            <p className="text-gray-400 text-xl mb-8 leading-relaxed font-medium">
                                No VyzGo, entendemos o corre do empreendedor. Por isso, criamos uma ferramenta que não exige que você seja um expert em tecnologia. 
                                Se você sabe enviar um áudio no Zap, você sabe criar sua vitrine.
                            </p>
                            <div className="flex items-center gap-4 text-indigo-400 font-black italic uppercase text-lg">
                                <CheckCircle size={24} /> 100% em Português
                                <span className="w-2 h-2 rounded-full bg-white/20 mx-2"></span>
                                <CheckCircle size={24} /> Suporte humanizado
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-[60px] rounded-full"></div>
                            <img 
                                src="/success_story.png" 
                                alt="Sucesso VyzGo" 
                                className="relative rounded-[40px] shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. EXTENDED FEATURES GRID - Responsive Text */}
            <section id="features" className="py-24 md:py-32 container mx-auto px-4 w-full">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">Feito para quem vende.</h2>
                    <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto font-medium">Tudo o que você precisa para transformar seguidores em pix na conta.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {[
                        { 
                            icon: <Zap />, 
                            title: "Rapidez", 
                            desc: "Sua vitrine abre instantaneamente. Sem esperas, sem desistências." 
                        },
                        { 
                            icon: <Palette />, 
                            title: "Visual", 
                            desc: "Dezenas de cores e estilos para sua vitrine ter a cara da sua marca." 
                        },
                        { 
                            icon: <BarChart />, 
                            title: "Cliques", 
                            desc: "Saiba exatamente quais produtos são os favoritos do seu público." 
                        },
                        { 
                            icon: <Smartphone />, 
                            title: "Mobile", 
                            desc: "Uma experiência perfeita para quem compra pelo celular." 
                        },
                        { 
                            icon: <CheckCircle />, 
                            title: "Sem Limites", 
                            desc: "Cadastre quantos produtos quiser. Sua vitrine cresce com você." 
                        },
                        { 
                            icon: <Share2 />, 
                            title: "Elegante", 
                            desc: "Centralize tudo em um só lugar de forma organizada." 
                        },
                    ].map((feature, i) => (
                        <div key={i} className="p-8 md:p-12 bg-neutral-900 border border-white/5 rounded-[32px] md:rounded-[40px] hover:border-indigo-500/30 transition-all duration-500 group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black mb-4 italic tracking-tight uppercase">{feature.title}</h3>
                            <p className="text-gray-450 text-base md:text-lg leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4.5 FREE TRIAL SECTION */}
            <section className="py-24 bg-gradient-to-r from-indigo-700 to-purple-800 w-full relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">Comece a vender hoje.</h2>
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
                        Crie sua vitrine agora e use todas as funções por 7 dias grátis. Use sem limites e veja os pedidos chegarem.
                    </p>
                    <a href="https://app.vyzgo.com" className="inline-flex items-center justify-center px-12 py-6 bg-white text-indigo-700 rounded-[30px] font-black text-2xl hover:bg-gray-100 transition-all shadow-2xl">
                        CRIAR MINHA VITRINE
                    </a>
                </div>
            </section>

            {/* 5. PRICING - Zero Commission Clarification */}
            <section id="pricing" className="py-40 bg-[#0A0A0A] w-full">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-7xl font-black mb-20 tracking-tighter italic uppercase">Transparência Total.</h2>

                    <div className="max-w-2xl mx-auto">
                        <div className="p-1 md:p-1.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[45px] shadow-[0_0_80px_rgba(79,70,229,0.15)]">
                            <div className="bg-[#0A0A0A] rounded-[43px] p-8 md:p-20 text-left relative overflow-hidden">
                                <div className="mb-14">
                                    <span className="text-[12px] font-black tracking-[0.4em] text-gray-500 uppercase">Valor Único Mensal</span>
                                    <div className="text-7xl md:text-8xl font-black mt-6 text-white tracking-tighter">R$ 29,90</div>
                                    <p className="text-indigo-400 text-xl mt-6 font-black uppercase italic">Zero Taxas Por Venda</p>
                                    <p className="text-gray-500 text-lg mt-2 font-medium">O lucro é 100% seu. Nós cobramos apenas pela tecnologia.</p>
                                </div>

                                <div className="space-y-6 mb-16 border-y border-white/5 py-14">
                                    <div className="flex items-center gap-5 text-gray-200 font-bold text-xl italic uppercase">
                                        <CheckCircle size={24} className="text-indigo-500 shrink-0" /> 
                                        <span>Vitrine Profissional</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-200 font-bold text-xl italic uppercase">
                                        <CheckCircle size={24} className="text-indigo-500 shrink-0" /> 
                                        <span>Produtos Ilimitados</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-200 font-bold text-xl italic uppercase">
                                        <CheckCircle size={24} className="text-indigo-500 shrink-0" /> 
                                        <span>Integração WhatsApp</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-200 font-bold text-xl italic uppercase">
                                        <CheckCircle size={24} className="text-indigo-500 shrink-0" /> 
                                        <span>Receba Pedidos Organizados</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-200 font-bold text-xl italic uppercase">
                                        <CheckCircle size={24} className="text-indigo-500 shrink-0" /> 
                                        <span>Suporte Brasileiro</span>
                                    </div>
                                </div>

                                <a href="https://app.vyzgo.com" className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[35px] font-black text-2xl text-center transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3">
                                    CRIAR MINHA VITRINE 🚀
                                </a>
                                <p className="text-center text-gray-600 text-[10px] mt-6 font-black uppercase tracking-widest opacity-60">
                                    Tecnologia brasileira de alta conversão.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ - Expanded and more interesting */}
            <section id="faq" className="py-32 container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight italic">Tirando Duvidas.</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tudo o que você precisa saber antes de lucrar com seu link na bio</p>
                </div>

                <div className="space-y-4">
                    {[
                        { 
                            q: "Como funcionam os 7 dias grátis?", 
                            a: "Você tem acesso total a todas as funcionalidades por 7 dias. Se não gostar, pode cancelar antes do período terminar e nada será cobrado. É o tempo ideal para você lançar sua loja e já fazer as primeiras vendas." 
                        },
                        { 
                            q: "O domínio próprio está incluso?", 
                            a: "O VyzGo fornece um subdomínio padrão grátis (ex: sualoja.vyzgo.com). Caso você já tenha um domínio (ex: sualoja.com.br), você pode vinculá-lo facilmente às configurações no painel administrativo." 
                        },
                        { 
                            q: "Preciso pagar comissão sobre as vendas?", 
                            a: "Absolutamente não! O VyzGo é uma ferramenta de software, não um marketplace. 100% do lucro da venda vai direto para você. Não cobramos taxas sobre transações." 
                        },
                        { 
                            q: "Posso vender produtos de afiliado e físicos juntos?", 
                            a: "Com certeza. Nossa tecnologia de Vitrine Híbrida permite que você venda um sapato (estoque próprio) ao lado de um link de acessório da Shopee (afiliado). O cliente finaliza cada um no seu canal correspondente." 
                        },
                        { 
                            q: "Quantos produtos posso cadastrar?", 
                            a: "Ilimitados! Diferente de outras plataformas que limitam por crescimento, aqui você pode ter 10 ou 10.000 produtos pagando o mesmo valor fixo mensal." 
                        },
                        { 
                            q: "A marca 'VyzGo' aparece no meu site?", 
                            a: "Sim, no rodapé da vitrine incluímos uma pequena atribuição 'Desenvolvido por VyzGo'. Isso ajuda a manter nossos custos acessíveis para todos os lojistas." 
                        },
                        { 
                            q: "O checkout é feito dentro da vitrine?", 
                            a: "O VyzGo foca na conversão via WhatsApp. Quando o cliente clica em comprar, ele é direcionado com o carrinho pronto para o seu Zap, onde você finaliza os detalhes de entrega e pagamento." 
                        }
                    ].map((item, i) => (
                        <div key={i} className="border border-white/5 rounded-[32px] bg-neutral-900/30 overflow-hidden group hover:border-white/10 transition-colors">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full p-8 flex items-center justify-between text-left transition-colors"
                            >
                                <span className="font-bold text-xl md:text-2xl text-gray-200 group-hover:text-white">{item.q}</span>
                                <ChevronDown className={`transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-indigo-400' : 'text-gray-500'}`} />
                            </button>
                            {openFaq === i && (
                                <div className="p-8 pt-0 text-gray-400 text-lg leading-relaxed border-t border-dashed border-white/10 mt-4 animate-fade-in">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="py-24 bg-black border-t border-white/5 text-center">
                <div className="flex justify-center mb-12">
                    <img src="/logo-main.png" alt="VyzGo" className="h-12 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-left">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">&copy; {new Date().getFullYear()} VyzGo Tecnologia. Desenvolvido para vender.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <Link to="/terms" className="text-gray-500 hover:text-white transition-colors font-black uppercase tracking-[0.2em] text-[10px]">Termos de Uso</Link>
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors font-black uppercase tracking-[0.2em] text-[10px]">Privacidade</Link>
                        <div className="flex gap-6 ml-4">
                            <Instagram size={22} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                            <MessageCircle size={22} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                  -ms-overflow-style: none;  /* IE and Edge */
                  scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
