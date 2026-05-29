import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// Pasar order-confirmation card — deep-green panel inside a bot message.
// Props: order = { items: [{ label, sub }], total, orderId }
export default function OrderCard({ order = {} }) {
  const { items = [], total, orderId } = order;
  return (
    <View style={styles.order}>
      <View style={styles.okRow}>
        <View style={styles.tick}><Text style={styles.tickTxt}>✓</Text></View>
        <Text style={styles.okTxt}>Pesanan dibuat</Text>
        {orderId ? <Text style={styles.oid}>{orderId}</Text> : null}
      </View>
      <View style={styles.lines}>
        {items.map((it, i) => (
          <View key={i}>
            <Text style={styles.lineLabel}>{it.label}</Text>
            {it.sub ? <Text style={styles.lineSub}>{it.sub}</Text> : null}
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLbl}>Total</Text>
        <Text style={styles.totalVal}>{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  order: {
    backgroundColor: colors.accentDeep,
    borderRadius: 18,
    padding: 17,
    width: '100%',
    shadowColor: colors.accentDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 5,
  },
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  okTxt: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: '#FFFFFF' },
  oid: { marginLeft: 'auto', fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  lines: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    paddingTop: 11,
    gap: 2,
  },
  lineLabel: { fontFamily: fonts.body, fontSize: 13.5, color: '#FFFFFF', fontWeight: '700', lineHeight: 22 },
  lineSub: { fontFamily: fonts.body, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  totalLbl: { fontFamily: fonts.display, fontWeight: '800', fontSize: 17, color: '#FFFFFF' },
  totalVal: { fontFamily: fonts.display, fontWeight: '800', fontSize: 17, color: '#FFFFFF' },
});
