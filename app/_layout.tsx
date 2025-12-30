import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import "../global.css";

export default function RootLayout() {
  return (
    <PaperProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{headerShown: true, headerTitle:"login"}} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
    </PaperProvider>
  )
}
