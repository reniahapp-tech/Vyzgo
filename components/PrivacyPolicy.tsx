import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Política de Privacidade</h1>
                </div>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Coleta de Informações</h2>
                        <p>Coletamos informações básicas para o funcionamento do serviço, como nome, e-mail de cadastro e dados da sua loja (configurações e produtos). Não coletamos dados sensíveis de pagamento, que são processados por parceiros externos.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Uso dos Dados</h2>
                        <p>Seus dados são utilizados exclusivamente para fornecer as funcionalidades do VyzGo, como personalização da vitrine e autenticação via Supabase/Google. Não vendemos suas informações para terceiros.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Cookies e Rastreamento</h2>
                        <p>Utilizamos cookies essenciais para manter sua sessão ativa e ferramentas de análise anônimas para melhorar a experiência do usuário na plataforma.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Segurança</h2>
                        <p>Empregamos práticas de segurança de ponta fornecidas pelo ecossistema Supabase para proteger seus dados contra acessos não autorizados. No entanto, nenhum sistema é 100% seguro.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
                        <p>Você tem total direito de solicitar a exclusão definitiva dos seus dados e da sua loja a qualquer momento através do suporte ou das configurações de conta.</p>
                    </section>

                    <div className="pt-10 border-t border-gray-100 text-sm text-gray-400">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
