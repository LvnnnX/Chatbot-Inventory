// Demo seed for the Pasar UI so the design can be previewed without a backend.
// Flip SHOW_DEMO to true to render the sample conversation (product cards +
// order confirmation) on first load. Production ships with this OFF — real
// messages come from the chat backend via useChat.
//
// Message shape: { from: 'user' | 'bot', text, time?, products?, order? }
//   products: [{ emoji, name, meta, price }]
//   order:    { orderId, items: [{ label, sub }], total }
export const SHOW_DEMO = false;

export const DEMO_MESSAGES = [
  { from: 'user', text: 'Tunjukin keyboard di bawah 200rb dong', time: '08.02' },
  {
    from: 'bot',
    text: 'Ada 3 keyboard di bawah Rp200.000 nih 👇',
    products: [
      { emoji: '⌨️', name: 'Keyboard Rexus K9', meta: 'Stok 24 · Mekanikal', price: 'Rp 175.000' },
      { emoji: '⌨️', name: 'Keyboard Votre M1', meta: 'Stok 8 · Membran', price: 'Rp 120.000' },
      { emoji: '⌨️', name: 'Keyboard Fantech P31', meta: 'Stok 41 · Wireless', price: 'Rp 95.000' },
    ],
  },
  { from: 'user', text: 'Pesan 2 yang Fantech ya', time: '08.03' },
  {
    from: 'bot',
    text: 'Sip, pesanan kamu udah aku buat ✨',
    order: {
      orderId: 'ORD-0291',
      items: [{ label: 'Fantech P31 × 2', sub: '@ Rp 95.000' }],
      total: 'Rp 190.000',
    },
  },
];
