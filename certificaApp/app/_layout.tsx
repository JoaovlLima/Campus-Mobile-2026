import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// ⚠️ CONFIRA: Sua pasta é 'service' (singular) ou 'services' (plural)? Ajuste aqui se precisar.
import { ProgressoService } from '../service/progresso'; 

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ❌ REMOVI O useEffect DAQUI.
  // Como atualizamos a lógica do banco, não precisamos mais "inicializar" manualmente.
  // O banco vai criar o usuário sozinho na primeira vez que ele concluir algo.

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Suas abas principais (Home, Trilhas, etc) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Tela de exemplo */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* --- NOVAS TELAS DO PROJETO --- */}
        <Stack.Screen name="detalhe-trilha" options={{ headerShown: false }} />
        <Stack.Screen name="player-video" options={{ headerShown: false }} />
        <Stack.Screen name="tela-quiz" options={{ headerShown: false }} />

        {/* Telas Modais */}
        <Stack.Screen name="detalhe-desafio" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="certificado-digital" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}