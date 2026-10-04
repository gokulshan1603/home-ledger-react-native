/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const {colors, isDark} = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.canvas} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
