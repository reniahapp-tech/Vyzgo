
import React, { useState, useEffect } from 'react';
import { listAllStores, saveConfigToR2 } from '../services/r2';
import { useConfig } from '../contexts/ConfigContext';
import { Store, Plus, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import { AppConfig } from '../types';

const MASTER_PIN = 'admin123'; // In production, move to env or backend auth

export const CorporateDashboard: React.FC = () => {
    const { config } = useConfig();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [stores, setStores] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newStoreId, setNewStoreId] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleLogin = () => {
        if (pin === MASTER_PIN) {
            setIsAuthenticated(true);
            loadStores();
        } else {
            alert('PIN Mestre incorreto');
        }
    };

    const loadStores = async () => {
        setIsLoading(true);
        const list = await listAllStores();
        setStores(list);
        setIsLoading(false);
    };

    const createStore = async () => {
        if (!newStoreId) return;

        // Basic validation
        const cleanId = newStoreId.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (cleanId !== newStoreId) {
            alert('Use apenas letras minúsculas, números e hífens.');
            return;
        }

        if (stores.includes(cleanId)) {
            alert('ID da loja já existe.');
            return;
        }

        if (!confirm(`Criar nova loja "${cleanId}"?`)) return;

        setIsCreating(true);
        try {
            // Create a fresh config based on the current template or a default one
            const newConfig: AppConfig = {
                ...config, // Clone current config as template
                header: {
                    ...config.header,
                    title: `Nova Loja (${cleanId})`,
                    subtitle: 'Configuração Inicial'
                }
            };

            await saveConfigToR2(cleanId, newConfig);
            alert('Loja criada com sucesso!');
            setNewStoreId('');
            loadStores();
        } catch (error) {
            alert('Erro ao criar loja.');
            console.error(error);
        }
        setIsCreating(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Acesso Corporativo</h2>
                    <input
                        type="password"
                        placeholder="PIN Mestre"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full text-center text-3xl tracking-widest p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                    <p className="text-center mt-4 text-xs text-gray-400">Ambiente seguro</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Store className="text-blue-600" />
                            Painel Corporativo
                        </h1>
                        <p className="text-gray-500 mt-2">Gerencie todas as suas franquias em um só lugar.</p>
                    </div>
                    <button
                        onClick={loadStores}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg border hover:bg-gray-50 transition"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        Atualizar Lista
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Connection: Create New */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-green-500" />
                                Nova Franquia
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Subdomínio / ID</label>
                                    <div className="flex items-center mt-1">
                                        <input
                                            value={newStoreId}
                                            onChange={(e) => setNewStoreId(e.target.value)}
                                            placeholder="ex: filial-centro"
                                            className="w-full p-3 bg-gray-50 border rounded-l-lg outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <span className="bg-gray-100 text-gray-500 p-3 border-y border-r rounded-r-lg select-none">
                                            .site
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Apenas letras minúsculas e hífens.</p>
                                </div>

                                <button
                                    onClick={createStore}
                                    disabled={!newStoreId || isCreating}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
                                        }`}
                                >
                                    {isCreating ? 'Criando...' : 'Lançar Loja 🚀'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Connection: List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-700">Lojas Ativas ({stores.length})</h3>
                            </div>

                            {isLoading ? (
                                <div className="p-12 text-center text-gray-400">Carregando lojas...</div>
                            ) : stores.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">Nenhuma loja encontrada na nuvem.</div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {stores.map(store => (
                                        <li key={store} className="p-4 hover:bg-blue-50/50 transition flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                                                    {store.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{store}</h4>
                                                    <a
                                                        href={`/?store=${store}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"
                                                    >
                                                        {window.location.origin}/?store={store}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={`/?store=${store}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium text-sm transition"
                                                >
                                                    Visualizar
                                                </a>
                                                <a
                                                    href={`/?store=${store}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition"
                                                    title="Abrir Painel Admin desta loja"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
