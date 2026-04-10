import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ text, from }) {
  const isBot = from === 'bot';
  return (
    <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
      <Text style={isBot ? styles.botText : styles.userText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#1F2937',
    fontSize: 16,
    lineHeight: 22,
  }
});
