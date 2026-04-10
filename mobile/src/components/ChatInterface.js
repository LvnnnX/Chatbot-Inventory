import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatInterface({ messages = [] }) {
  return (
    <View style={styles.container}>
      {messages.map((m, idx) => (
        <Text key={idx} style={m.from === 'bot' ? styles.bot : styles.user}>{m.text}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  user: { alignSelf: 'flex-end', backgroundColor: '#e1ffc7', padding: 8, borderRadius: 8, marginVertical: 4 },
  bot: { alignSelf: 'flex-start', backgroundColor: '#fff', padding: 8, borderRadius: 8, marginVertical: 4, borderWidth: 1, borderColor: '#ddd' }
});
