import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, RefreshControl,
} from 'react-native';
import { getPostsPorUsuario } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function FeedScreen({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('FormularioTab')}
                    style={{ marginRight: 4, padding: 4 }}
                >
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: '300' }}>+</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        carregarPosts();
    }, []);

    // ── PRIMEIRA CARGA ───────────────────────────────
    async function carregarPosts() {
        try {
            setLoading(true);
            setErro(null);

            const dados = await getPostsPorUsuario(1, 1);

            setPosts(dados);
            setPage(1);

            navigation.setOptions({
                title: `PostBoard (${dados.length})`,
            });

        } catch (e) {
            setErro('Não foi possível carregar os posts.\nVerifique sua conexão.');
        } finally {
            setLoading(false);
        }
    }

    // ── CARREGAR MAIS (PAGINAÇÃO) ────────────────────
    async function carregarMais() {
        try {
            setLoadingMore(true);

            const proximaPagina = page + 1;

            const novosDados = await getPostsPorUsuario(1, proximaPagina);

            setPosts(prev => [...prev, ...novosDados]);
            setPage(proximaPagina);

            navigation.setOptions({
                title: `PostBoard (${posts.length + novosDados.length})`,
            });

        } catch (e) {
            console.error('Erro ao carregar mais:', e);
        } finally {
            setLoadingMore(false);
        }
    }

    // ── REFRESH ─────────────────────────────────────
    async function onRefresh() {
        try {
            setRefreshing(true);
            setErro(null);

            const dados = await getPostsPorUsuario(1, 1);

            setPosts(dados);
            setPage(1);

            navigation.setOptions({
                title: `PostBoard (${dados.length})`,
            });

        } catch (e) {
            setErro('Erro ao atualizar.');
        } finally {
            setRefreshing(false);
        }
    }

    if (loading) {
        return <LoadingIndicator mensagem="Carregando posts..." />;
    }

    if (erro && posts.length === 0) {
        return (
            <EmptyState
                icone="⚠️"
                titulo="Ops! Algo deu errado"
                mensagem={erro}
                textoBotao="Tentar novamente"
                onBotao={carregarPosts}
            />
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onPress={() => navigation.navigate('Detalhes', { post: item })}
                    />
                )}

                ListEmptyComponent={
                    <EmptyState
                        icone="📭"
                        titulo="Nenhum post encontrado"
                        mensagem="A lista está vazia no momento."
                    />
                }

                // BOTÃO "CARREGAR MAIS"
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.botaoCarregarMais}
                        onPress={carregarMais}
                        disabled={loadingMore}
                    >
                        <Text style={styles.textoCarregarMais}>
                            {loadingMore ? 'Carregando...' : 'Carregar mais'}
                        </Text>
                    </TouchableOpacity>
                }

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1a56db']}
                        tintColor="#1a56db"
                    />
                }

                contentContainerStyle={
                    posts.length === 0 ? styles.listaVazia : styles.lista
                }

                ItemSeparatorComponent={() => <View style={styles.separador} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    lista: {
        padding: 16,
        paddingBottom: 32,
    },
    listaVazia: {
        flex: 1,
        justifyContent: 'center',
    },
    separador: {
        height: 12,
    },

    // ESTILO DO BOTÃO
    botaoCarregarMais: {
        backgroundColor: '#e5e7eb',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoCarregarMais: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
});