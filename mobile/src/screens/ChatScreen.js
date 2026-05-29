import React from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatInterface from '../components/ChatInterface';
import useChat from '../hooks/useChat';
import { colors, fonts } from '../theme';

const QUICK_REPLIES = ['Lihat mouse', 'Di bawah 100rb', 'Cek pesananku'];

export default function ChatScreen() {
  const { messages, input, setInput, send, isLoading } = useChat();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.mark}><Text style={styles.markTxt}>T</Text></View>
          <View>
            <Text style={styles.title}>Toko Pinter</Text>
            <View style={styles.statusRow}>
              <View style={styles.dot} />
              <Text style={styles.statusTxt}>Siap bantu belanja</Text>
            </View>
          </View>
        </View>

        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onAddProduct={(p) => send(`Pesan ${p.name}`)}
        />

        {/* Quick replies */}
        <View style={styles.chipsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {QUICK_REPLIES.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.chip}
                activeOpacity={0.7}
                onPress={() => send(q)}
                accessibilityRole="button"
                accessibilityLabel={q}
              >
                <Text style={styles.chipTxt}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Compose */}
        <View style={styles.compose}>
          <TextInput
            style={styles.field}
            value={input}
            onChangeText={setInput}
            placeholder="Ketik pesanan…"
            placeholderTextColor={colors.inkSoft}
            multiline
            maxLength={500}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.send, (!input.trim() || isLoading) && styles.sendDisabled]}
            onPress={() => send()}
            disabled={!input.trim() || isLoading}
            accessibilityRole="button"
            accessibilityLabel="Kirim pesan"
            activeOpacity={0.85}
          >
            <Text style={styles.sendTxt}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  container: { flex: 1, backgroundColor: colors.convoBg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    zIndex: 5,
  },
  mark: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  markTxt: { fontFamily: fonts.display, fontWeight: '800', fontSize: 24, color: '#FFFFFF' },
  title: { fontFamily: fonts.display, fontWeight: '800', fontSize: 21, color: colors.ink, letterSpacing: -0.4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  statusTxt: { fontFamily: fonts.body, fontSize: 12.5, color: colors.accentDeep, fontWeight: '600' },

  chipsWrap: { backgroundColor: colors.convoBg },
  chips: { flexDirection: 'row', gap: 9, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  chipTxt: { fontFamily: fonts.body, fontSize: 13, fontWeight: '600', color: colors.accentDeep },

  compose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 22,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  field: {
    flex: 1,
    backgroundColor: '#F2F7F4',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.ink,
    fontFamily: fonts.body,
    maxHeight: 100,
  },
  send: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 4,
  },
  sendDisabled: { backgroundColor: colors.inkSoft, shadowOpacity: 0 },
  sendTxt: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' },
});
