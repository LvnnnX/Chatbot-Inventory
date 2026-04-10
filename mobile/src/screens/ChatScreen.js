import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ChatInterface from '../components/ChatInterface';
import useChat from '../hooks/useChat';

export default function ChatScreen() {
  const { messages, input, setInput, send } = useChat();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <ChatInterface messages={messages} />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={() => send()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }
  ,
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 6, padding: 8, marginRight: 8 }
});
