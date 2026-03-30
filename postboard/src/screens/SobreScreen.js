import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SobreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>PostBoard</Text>
            <Text style={styles.info}>Versão 1.0.0</Text>
            <Text style={styles.info}>Desenvolvido por Diego 3°MTEC</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8
    },
    info: {
        fontSize: 15,
        color: '#6b7280'
    },
});