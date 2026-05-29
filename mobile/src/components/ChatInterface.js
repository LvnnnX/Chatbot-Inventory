import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MessageBubble from './MessageBubble';
import { colors } from '../styles/theme';

export default function ChatInterface({ messages = [], isLoading = false }) {
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <MessageBubble text={item.text} from={item.from} />
  );

  const data = messages.length > 0
    ? messages
    : [{ text: 'Ask about stock, prices, product search, or place an order in natural language.', from: 'system' }];

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `${item.from}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Inventory assistant is checking MCP tools...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.inkMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
