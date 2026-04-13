import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Configurações globais de cache ───────────────────────
const PREFIXO = '@postboard:';
const TTL_MS = 5 * 60 * 1000; // 5 minutos em milissegundos

// ── Chaves padronizadas ───────────────────────────────────
// Centralizar as chaves evita erros de digitação espalhados
// pelo código. Se uma chave mudar, alteramos só aqui.
export const CHAVES = {
    POSTS: `${PREFIXO}posts`,
    POST: (id) => `${PREFIXO}post_${id}`,
    USUARIO: (id) => `${PREFIXO}usuario_${id}`,
};

// ── Estrutura de um item de cache ─────────────────────────
// Cada item salvo tem dois campos:
//   dados     — o conteúdo real (objeto, array, etc.)
//   timestamp — quando foi salvo (Date.now() em ms)
//
// Exemplo no AsyncStorage:
// {
//   dados: [ { id: 1, title: '...' }, ... ],
//   timestamp: 1710000000000
// }

// ── salvar ───────────────────────────────────────────────
// Salva qualquer dado com timestamp atual
export async function salvar(chave, dados) {
    try {
        const item = {
            dados,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(chave, JSON.stringify(item));
    } catch (e) {
        // Falha no cache nunca deve travar o app
        console.warn(`[cache] Erro ao salvar '${chave}':`, e.message);
    }
}

// ── ler ──────────────────────────────────────────────────
// Lê um item. Retorna null se não existe ou se expirou.
// respeitar TTL: se false, retorna mesmo dados expirados
export async function ler(chave, respeitarTTL = true) {
    try {
        const json = await AsyncStorage.getItem(chave);
        if (json === null) return null; // Não existe

        const item = JSON.parse(json);

        // Verifica se o cache expirou
        if (respeitarTTL) {
            const idade = Date.now() - item.timestamp;
            if (idade > TTL_MS) {
                console.log(`[cache] '${chave}' expirado (${Math.round(idade / 1000)}s atrás)`);
                return null; // Dado expirado — tratar como inexistente
            }
        }

        return item.dados;
    } catch (e) {
        console.warn(`[cache] Erro ao ler '${chave}':`, e.message);
        return null;
    }
}

// ── lerMesmoExpirado ─────────────────────────────────────
// Útil para modo offline: retorna dados mesmo velhos
// quando não há conexão com a internet
export async function lerMesmoExpirado(chave) {
    return ler(chave, false);
}

// ── remover ──────────────────────────────────────────────
export async function remover(chave) {
    try {
        await AsyncStorage.removeItem(chave);
    } catch (e) {
        console.warn(`[cache] Erro ao remover '${chave}':`, e.message);
    }
}

// ── limparTudo ───────────────────────────────────────────
// Remove TODOS os dados do app (usar só em configurações/logout)
export async function limparTudo() {
    try {
        const todasChaves = await AsyncStorage.getAllKeys();
        // Filtra apenas as chaves do PostBoard (segurança)
        const chavesDoApp = todasChaves.filter(k => k.startsWith(PREFIXO));
        if (chavesDoApp.length > 0) {
            await AsyncStorage.multiRemove(chavesDoApp);
        }
        console.log(`[cache] ${chavesDoApp.length} item(s) removido(s).`);
    } catch (e) {
        console.warn('[cache] Erro ao limpar cache:', e.message);
    }
}

// ── informacoes ──────────────────────────────────────────
// Retorna um resumo do cache para exibir em tela de debug
export async function informacoes() {
    try {
        const todasChaves = await AsyncStorage.getAllKeys();
        const chavesDoApp = todasChaves.filter(k => k.startsWith(PREFIXO));

        const detalhes = await Promise.all(
            chavesDoApp.map(async (chave) => {
                const json = await AsyncStorage.getItem(chave);
                const item = JSON.parse(json);
                const idadeSegundos = Math.round((Date.now() - item.timestamp) / 1000);
                return { chave, idadeSegundos };
            })
        );

        return detalhes;
    } catch (e) {
        return [];
    }
}