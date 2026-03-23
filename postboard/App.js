import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const testarAlerta = () => {
    Alert.alert(
      'Funcionou!',
      'O projeto está pronto para começar.',
      [{ text: 'OK' }]
    );
  };

  const verDocumentacao = () => {
    Alert.alert(
      'Conheça a API pelo link abaixo!',
      'https://jsonplaceholder.typicode.com',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.titulo}>PostBoard</Text>

      <Animated.Text style={[styles.subtitulo, { opacity }]}>
        Módulo 1 — Ambiente pronto!
      </Animated.Text>

      <Text style={styles.subtitulo}>Diego Jr. — 3°MTEC</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={testarAlerta}
      >
        <Text style={styles.textoBotao}>Testar alerta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={verDocumentacao}
      >
        <Text style={styles.textoBotao}>Ver documentação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#1a56db',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});