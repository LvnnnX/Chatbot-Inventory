import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, shadows } from '../styles/theme';

export default function MessageBubble({ text, from }) {
  const isBot = from === 'bot';
  const isSystem = from === 'system';

  return (
    <View style={[
      styles.bubble,
      isBot ? styles.botBubble : styles.userBubble,
      isSystem && styles.systemBubble,
    ]}>
      <Text style={[isBot ? styles.botText : styles.userText, isSystem && styles.systemText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: '86%',
    ...shadows.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  systemBubble: {
    alignSelf: 'center',
    maxWidth: '92%',
    backgroundColor: colors.primarySoft,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  userText: {
    color: colors.surface,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  botText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
  },
  systemText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
});
