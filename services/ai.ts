
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export const generateProductDescription = async (name: string, price: string, category: string): Promise<string> => {
    if (!model) {
        if (!API_KEY) throw new Error("Chave API do Gemini não configurada.");
        throw new Error("Modelo não inicializado.");
    }

    const prompt = `
    Atue como um copywriter profissional de e-commerce de moda/lifestyle.
    Escreva uma descrição atraente, curta e persuasiva (máximo 2 frases) para este produto:
    
    Produto: ${name}
    Categoria: ${category}
    Preço: ${price}
    
    Use tom sofisticado porém acessível. Em Português do Brasil.
    Não use aspas na resposta.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Erro na IA:", error);
        throw new Error("Falha ao gerar descrição.");
    }
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const chatWithShopper = async (history: ChatMessage[], userMessage: string, catalogContext: string): Promise<string> => {
    if (!model) {
        if (!API_KEY) return "Desculpe, meu cérebro de IA não está conectado (Falta API Key).";
        return "Erro de conexão com IA.";
    }

    // System instruction to guide behavior and provide context
    const systemInstruction = `
        Você é um Personal Shopper virtual da loja "Boutique Elegance".
        Seu objetivo é ajudar o cliente a escolher produtos do nosso catálogo.
        
        CATÁLOGO DA LOJA (JSON):
        ${catalogContext}
        
        DIRETRIZES:
        1. Seja simpático, breve e aja como um vendedor humano.
        2. Se o cliente pedir recomendação, sugira PRODUTOS DO CATÁLOGO que façam sentido.
        3. Nunca invente produtos que não estão no JSON.
        4. Responda sempre em Português do Brasil.
        5. Tente fechar a venda convidando para ver o produto.
    `;

    try {
        // Construct the chat history for Gemini
        // Gemini expects history in specific format, but for single-turn or simple stateless, we can just append
        // For 'chat' feature in SDK:
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. Sou o Personal Shopper da Boutique Elegance. Como posso ajudar?" }],
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro no Chat IA:", error);
        return "Desculpe, estou tendo dificuldades para pensar agora. Tente novamente.";
    }
};
