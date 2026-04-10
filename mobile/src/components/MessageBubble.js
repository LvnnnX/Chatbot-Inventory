import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ text, from }) {
  const isBot = from === 'bot';
  return (
    <View style={[styles.bubble, isBot ? styles.bot : styles.user]}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 8, borderRadius: 8, marginVertical: 4, maxWidth: '78%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#e1ffc7' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' }
});
