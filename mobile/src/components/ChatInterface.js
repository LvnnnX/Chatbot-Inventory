import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MessageBubble from './MessageBubble';
import ProductCard from './ProductCard';
import OrderCard from './OrderCard';
import { colors, fonts } from '../theme';

// Renders one chat row: the text bubble, an optional timestamp, and optional
// rich content (product cards / order confirmation) stacked below the bubble.
function Row({ item, onAddProduct }) {
  const isBot = item.from === 'bot';
  const hasRich = (item.products && item.products.length) || item.order;
  return (
    <View
      style={[
        styles.row,
        isBot ? styles.rowBot : styles.rowMe,
        hasRich && styles.rowWide,
      ]}
    >
      <MessageBubble text={item.text} from={item.from} />
      {item.time ? <Text style={styles.stamp}>{item.time}</Text> : null}

      {item.products && item.products.length > 0 && (
        <View style={styles.cards}>
          {item.products.map((p, i) => (
            <ProductCard key={i} {...p} onAdd={() => onAddProduct && onAddProduct(p)} />
          ))}
        </View>
      )}

      {item.order && (
        <View style={styles.orderWrap}>
          <OrderCard order={item.order} />
        </View>
      )}
    </View>
  );
}

export default function ChatInterface({ messages = [], isLoading = false, onAddProduct }) {
  const listRef = useRef(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Row item={item} onAddProduct={onAddProduct} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.loadingText}>Sedang mengetik…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.convoBg },
  listContent: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 12, gap: 18 },
  row: { maxWidth: '84%' },
  rowMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  rowBot: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  rowWide: { maxWidth: '92%' },
  stamp: { fontFamily: fonts.body, fontSize: 11, color: colors.inkSoft, marginTop: 6, paddingHorizontal: 6 },
  cards: { marginTop: 11, gap: 11, width: '100%' },
  orderWrap: { marginTop: 11, width: '100%' },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 14 },
  loadingText: { marginLeft: 2, color: colors.inkSoft, fontSize: 14, fontStyle: 'italic', fontFamily: fonts.body },
});
