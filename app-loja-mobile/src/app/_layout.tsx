import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // O Stack gerencia a pilha de telas do seu app
    <Stack 
      screenOptions={{ 
        headerShown: false // Remove o cabeçalho padrão para ficar com o visual limpo do login
      }}
    >
      {/* 
        O Expo Router detecta automaticamente os arquivos.
        Como você tem index.tsx e admin.tsx na pasta, 
        o Stack já entende que estas são as rotas disponíveis.
      */}
      <Stack.Screen name="index" /> {/* Esta é a tela de login script index.tsx*/}
      <Stack.Screen name="admin" /> {/* Esta é a tela administrativa  script admin.tsx*/}
      <Stack.Screen name="dashboard" /> {/* Esta é a tela do dashboard  script dashboard.tsx*/}

    </Stack>
  );
}