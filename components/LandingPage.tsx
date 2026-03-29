
import React, { useState } from 'react';
import {
    Sparkles, Layers, MessageCircle, Link as LinkIcon, Smartphone, Zap,
    CheckCircle, ArrowRight, Menu, X, Palette, Globe, ChevronDown,
    Instagram, ShoppingBag, BarChart, Map, Share2
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden w-full">

            {/* 1. NAVBAR - Sticky & Glassmorphism */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center transition-transform hover:scale-105">
                        <img src="/logo-main.png" alt="VyzGo" className="h-10 md:h-14 w-auto object-contain brightness-0 invert" />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
                        <a href="#demo" className="hover:text-white transition-colors">Demonstração</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>

                    {/* CTA Desktop */}
                    <a href="https://app.vyzgo.com" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-200 transition-all transform hover:scale-105">
                        Criar Grátis
                    </a>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-neutral-900 border-b border-zinc-800 p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
                        <a href="#features" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
                        <a href="#demo" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Demonstração</a>
                        <a href="#pricing" className="py-2 text-lg text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Preços</a>
                        <a href="https://app.vyzgo.com" className="mt-4 w-full py-4 bg-purple-600 text-white font-bold rounded-xl text-center" onClick={() => setIsMenuOpen(false)}>
                            Começar Agora
                        </a>
                    </div>
                )}
            </nav>

            {/* 2. HERO SECTION - Centered & High Impact */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 w-full overflow-hidden flex flex-col items-center text-center">
                {/* Background Glow - Contained */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-purple-900/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-8">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Nova Tecnologia 2.0
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1]">
                    Pare de perder vendas no <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        Linktree Básico.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Transforme sua Bio em uma Vitrine Híbrida: Venda produtos físicos, infoprodutos e afiliados. Tudo em um único lugar, integrado ao WhatsApp e com IA.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
                    <a href="https://app.vyzgo.com" className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2">
                        <Zap size={20} fill="currentColor" />
                        Criar Minha Bio
                    </a>
                    <a href="/demo" className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                        Ver Exemplo Real
                    </a>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black" />
                        <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black" />
                        <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-black" />
                    </div>
                    <p>Usado por +10.000 creators</p>
                </div>
            </section>

            {/* 3. VSL / DEMO MOCKUP */}
            <section id="demo" className="py-20 bg-neutral-900 border-y border-white/5 w-full">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-black rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                        {/* Text Side */}
                        <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-6">Seu Link na Bio Profissional.</h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Checkout no WhatsApp</h3>
                                        <p className="text-gray-400 text-sm">Seu cliente escolhe os produtos e o pedido chega pronto no seu Zap. Sem taxas.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                        <LinkIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Modo Afiliado & Dropshipping</h3>
                                        <p className="text-gray-400 text-sm">Cadastre produtos da Shopee/Amazon. O cliente clica, compra lá e você ganha a comissão.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                        <Palette size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Identidade Visual Total</h3>
                                        <p className="text-gray-400 text-sm">Troque temas, cores e fontes com um clique. Dark mode, Light mode e muito mais.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Visual Side (Mockup) */}
                        <div className="lg:w-1/2 bg-zinc-900 relative min-h-[400px] flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
                            {/* Phone Frame */}
                            <div className="relative w-[280px] h-[580px] bg-black border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-white/10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 rounded-b-xl w-32 mx-auto"></div>
                                <img
                                    src="/demo-preview.png"
                                    alt="Demo Store Interface"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Play Button to indicate clickability */}
                                <a href="/demo" className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                                        <ArrowRight size={32} className="text-white ml-1" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. GRID FEATURES */}
            <section id="features" className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Feito para quem vende.</h2>
                    <p className="text-gray-400 text-lg">Tudo o que você precisa para profissionalizar seu Instagram/TikTok.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Globe />, title: "Domínio Próprio", desc: "Use seu nome.com.br ou nosso subdomínio grátis." },
                        { icon: <ShoppingBag />, title: "Gestão de Pedidos", desc: "Painel administrativo completo para controlar suas vendas." },
                        { icon: <Map />, title: "Mapa Integrado", desc: "Mostre a localização exata da sua loja física com um mapa interativo." },
                        { icon: <Share2 />, title: "Redes Sociais", desc: "Conecte seu Instagram, TikTok e Facebook diretamente no rodapé." },
                        { icon: <Zap />, title: "IA Generativa", desc: "O Magic Copywriter cria descrições persuasivas para você." },
                        { icon: <MessageCircle />, title: "Chatbot IA", desc: "O Personal Shopper atende clientes 24h por dia." },
                    ].map((feature, i) => (
                        <div key={i} className="p-8 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. PRICING */}
            <section id="pricing" className="py-20 bg-neutral-900 w-full border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Planos simples. Sem surpresas.</h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free */}
                        <div className="p-8 rounded-3xl bg-black border border-zinc-800 flex flex-col text-left">
                            <div className="mb-4">
                                <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">Starter</span>
                                <div className="text-4xl font-bold mt-2 text-white">Grátis</div>
                                <p className="text-gray-400 text-sm mt-2">Para quem está começando.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500" /> 1 Vitrine</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500" /> 15 Produtos</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500" /> Integração WhatsApp</li>
                            </ul>
                            <a href="https://app.vyzgo.com" className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-center transition-colors">
                                Começar Grátis
                            </a>
                        </div>

                        {/* Pro */}
                        <div className="p-8 rounded-3xl bg-zinc-900 border border-purple-500 relative flex flex-col text-left overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Mais Popular</div>
                            <div className="mb-4">
                                <span className="text-sm font-bold tracking-wider text-purple-400 uppercase">Pro</span>
                                <div className="text-4xl font-bold mt-2 text-white">R$ 29,90<span className="text-lg font-normal text-gray-500">/mês</span></div>
                                <p className="text-gray-400 text-sm mt-2">Para quem quer vender de verdade.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle size={16} className="text-purple-500" /> Produtos Ilimitados</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle size={16} className="text-purple-500" /> IA (Copywriter + Chat)</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle size={16} className="text-purple-500" /> Remoção da Marca Vitrine</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle size={16} className="text-purple-500" /> Pixel do Facebook & TikTok</li>
                            </ul>
                            <button onClick={() => alert("Em breve!")} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-bold text-center transition-opacity shadow-lg shadow-purple-900/30">
                                Assinar Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section id="faq" className="py-20 container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold mb-10 text-center">Perguntas Frequentes</h2>
                <div className="space-y-4">
                    {[
                        { q: "Preciso pagar comissão sobre as vendas?", a: "Não! No plano Grátis e Pro, 100% do valor da venda vai direto para você. Não cobramos taxas sobre transações." },
                        { q: "Como funciona a integração com WhatsApp?", a: "Quando o cliente finaliza o pedido, o sistema gera, automaticamente, uma mensagem pronta com a lista de itens, total e endereço, e abre o seu WhatsApp para enviar." },
                        { q: "Posso usar meu próprio domínio?", a: "Sim! No plano Pro você pode conectar seu domínio (ex: sualoja.com) em vez de usar sualoja.vyzgo.com." },
                        { q: "O que é o Modo Híbrido?", a: "É a capacidade exclusiva do VyzGo de permitir que você venda produtos próprios (físicos) e produtos de afiliado (links externos) na mesma página, sem confundir o cliente." }
                    ].map((item, i) => (
                        <div key={i} className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-200">{item.q}</span>
                                <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaq === i && (
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-dashed border-zinc-800 mt-2">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="py-12 bg-black border-t border-zinc-900 text-center text-gray-600 text-sm">
                <div className="flex justify-center mb-8">
                    <img src="/logo-main.png" alt="VyzGo" className="h-8 w-auto object-contain brightness-0 invert opacity-50 hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center justify-center gap-6 mb-8">
                    <Instagram className="hover:text-purple-500 cursor-pointer transition-colors" />
                    <MessageCircle className="hover:text-green-500 cursor-pointer transition-colors" />
                </div>
                <p className="mb-2">&copy; {new Date().getFullYear()} VyzGo Tecnologia Ltda.</p>
                <div className="flex justify-center gap-4 text-xs">
                    <a href="#" className="hover:underline">Termos de Uso</a>
                    <a href="#" className="hover:underline">Privacidade</a>
                </div>
            </footer>

            <style>{`
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
