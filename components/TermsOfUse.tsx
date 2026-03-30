import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-stone-50 md:bg-gray-100 p-4 md:p-12 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-2xl p-8 md:p-16 border border-gray-100 animate-fade-in">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                >
                    <ArrowLeft size={18} /> Voltar
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Termos de Uso</h1>
                </div>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                        <p>Ao acessar e utilizar a plataforma VyzGo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com algum destes termos, não utilize nossos serviços.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
                        <p>O VyzGo é uma ferramenta de vitrine digital que facilita a exibição de produtos e o redirecionamento para checkouts externos ou WhatsApp. Não processamos pagamentos diretamente nem nos responsabilizamos pela entrega de produtos físicos ou digitais vendidos pelos usuários.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
                        <p>O usuário é inteiramente responsável pelo conteúdo publicado em sua vitrine, incluindo imagens, preços e descrições. É proibida a venda de itens ilegais, enganosos ou que violem direitos autorais.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Assinaturas e Pagamentos</h2>
                        <p>Planos Pro podem ser oferecidos com funcionalidades adicionais. O cancelamento pode ser feito a qualquer momento através do painel administrativo, mantendo o acesso até o fim do período já pago.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitação de Responsabilidade</h2>
                        <p>O VyzGo não garante que o serviço será ininterrupto ou livre de erros. Em nenhum caso seremos responsáveis por danos indiretos resultantes do uso ou da incapacidade de usar a plataforma.</p>
                    </section>

                    <div className="pt-10 border-t border-gray-100 text-sm text-gray-400">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
