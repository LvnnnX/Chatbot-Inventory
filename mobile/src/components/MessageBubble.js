import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme';

// Pasar text bubble. User = dark ink, bot = white with hairline border.
export default function MessageBubble({ text, from }) {
  const isBot = from === 'bot';
  return (
    <View style={[styles.bubble, isBot ? styles.bot : styles.me]}>
      <Text style={[styles.text, isBot ? styles.botText : styles.meText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: radius,
  },
  me: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 7,
  },
  bot: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 7,
    shadowColor: '#0B1F14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 23,
  },
  meText: { color: '#FFFFFF' },
  botText: { color: colors.ink },
});
