import React from 'react';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/StackNavigator';

// Load the Pasar fonts (Bricolage Grotesque + Manrope) on web.
// expo start --web renders through react-native-web, so a Google Fonts
// <link> is the simplest reliable way to make the font families resolve.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const id = 'pasar-fonts';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
}

export default function App() {
  return <AppNavigator />;
}
