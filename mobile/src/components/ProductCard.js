import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme';

// Pasar product card — appears inline inside a bot message.
// Props: emoji, name, meta (e.g. "Stok 24 · Mekanikal"), price, onAdd
export default function ProductCard({ emoji = '📦', name, meta, price, onAdd }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        <Text style={styles.price}>{price}</Text>
      </View>
      <TouchableOpacity
        style={styles.add}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={`Tambah ${name}`}
        activeOpacity={0.8}
      >
        <Text style={styles.addTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    shadowColor: '#0B1F14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 13,
    backgroundColor: colors.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 27 },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15.5,
    color: colors.ink,
    letterSpacing: -0.1,
  },
  meta: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 3 },
  price: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 16,
    color: colors.accentDeep,
    marginTop: 5,
  },
  add: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  addTxt: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', lineHeight: 26 },
});
