import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { 
  Users, Store, Activity, Settings, Plus, Search, 
  ExternalLink, Shield, BarChart3, Globe, Package,
  TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
    const { addToast } = useConfig();
    const [stats, setStats] = useState({
        totalStores: 0,
        totalAgencies: 0,
        activeToday: 24,
        newSignups: 5
    });
    const [stores, setStores] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadGlobalState();
    }, []);

    const loadGlobalState = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/list-stores');
            if (response.ok) {
                const data = await response.json();
                const allStores = data.stores as string[];
                setStores(allStores);
                
                // Calculate agency count (unique prefixes before first dash)
                const agencies = new Set();
                allStores.forEach(s => {
                    if (s.includes('-')) {
                        const parts = s.split('-');
                        if (parts[0].startsWith('agency')) {
                            agencies.add(parts[0]);
                        }
                    }
                });
                
                setStats(prev => ({
                    ...prev,
                    totalStores: allStores.length,
                    totalAgencies: agencies.size
                }));
            }
        } catch (e) {
            addToast('Erro ao carregar dados globais', 'error');
        }
        setIsLoading(false);
    };

    const filteredStores = stores.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Shield className="text-indigo-600" size={32} />
                            Painel Master <span className="text-sm font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest ml-2">Super Admin</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Gerenciamento global da plataforma VyzGo.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={loadGlobalState}
                            className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-gray-500"
                        >
                            <Activity size={20} />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Plus size={20} />
                            Novo Parceiro
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total de Lojas" 
                        value={stats.totalStores} 
                        icon={<Store className="text-blue-600" />} 
                        trend="+12% este mês" 
                        color="blue"
                    />
                    <StatCard 
                        title="Agências/Parceiros" 
                        value={stats.totalAgencies} 
                        icon={<Users className="text-indigo-600" />} 
                        trend="+2 novas" 
                        color="indigo"
                    />
                    <StatCard 
                        title="Ativas Hoje" 
                        value={stats.activeToday} 
                        icon={<TrendingUp className="text-green-600" />} 
                        trend="Normal" 
                        color="green"
                    />
                    <StatCard 
                        title="Novos Cadastros" 
                        value={stats.newSignups} 
                        icon={<CheckCircle2 className="text-orange-600" />} 
                        trend="24h" 
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Store List */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-xl font-black text-gray-800 tracking-tight">Todas as Instâncias</h3>
                                <div className="relative group min-w-[300px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por slug ou ID..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Loja / Slug</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">Carregando instâncias...</td>
                                            </tr>
                                        ) : filteredStores.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">Nenhuma loja encontrada.</td>
                                            </tr>
                                        ) : filteredStores.map(store => (
                                            <tr key={store} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase shrink-0">
                                                            {store.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-800">{store}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{store.includes('agency') ? 'Sub-instância' : 'Independente'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {store.includes('-') ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                            Partner
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                            Direct
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="inline-flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase tracking-wider">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        Online
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right space-x-2">
                                                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18} /></button>
                                                    <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Settings size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools & Info */}
                    <div className="xl:col-span-1 space-y-8">
                        {/* System Health */}
                        <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Activity className="text-indigo-300" />
                                Saúde do Sistema
                            </h3>
                            <div className="space-y-6">
                                <HealthItem label="API Gateway" status="operational" />
                                <HealthItem label="Storage R2" status="operational" />
                                <HealthItem label="Auth Engine" status="operational" />
                                <HealthItem label="Gemini AI" status="operational" />
                            </div>
                            <div className="mt-8 p-4 bg-indigo-800/50 rounded-2xl border border-indigo-700/50">
                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Último Backup</p>
                                <p className="text-sm font-medium">Hoje às 04:00 (Sucesso)</p>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                                <AlertCircle className="text-orange-500" />
                                Alertas Recentes
                            </h3>
                            <ul className="space-y-4">
                                <AlertItem text="Limite de Storage atingido (Agency-Vyz)" time="2h ago" type="warning" />
                                <AlertItem text="Novo Parceiro: Wint Digital" time="5h ago" type="info" />
                                <AlertItem text="Backup automático concluído" time="8h ago" type="success" />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const StatCard = ({ title, value, icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-all cursor-default">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-${color}-50 rounded-2xl`}>{icon}</div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${color === 'green' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                {trend}
            </span>
        </div>
        <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{title}</div>
    </div>
);

const HealthItem = ({ label, status }: any) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-100 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-green-400 flex items-center gap-2">
            <CheckCircle2 size={14} /> {status}
        </span>
    </div>
);

const AlertItem = ({ text, time, type }: any) => {
    const colors: any = {
        warning: 'border-orange-100 bg-orange-50 text-orange-700',
        success: 'border-green-100 bg-green-50 text-green-700',
        info: 'border-indigo-100 bg-indigo-50 text-indigo-700'
    };
    return (
        <li className={`p-4 border rounded-2xl ${colors[type]} transition-transform hover:scale-[1.02] cursor-default`}>
            <p className="text-sm font-bold tracking-tight">{text}</p>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">{time}</p>
        </li>
    );
};
