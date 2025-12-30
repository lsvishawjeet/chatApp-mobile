import { SocketProvider } from "@/context/SocketContext";
import { getToken } from "@/utilities/authStore";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function MainLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
      setIsLoading(false);
    };
    fetchToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SocketProvider token={token}>
      <Stack>
        <Stack.Screen name="users" options={{ headerTitle: "Users" }} />
        <Stack.Screen name="chat/[id]" options={{ headerTitle: "Chat" }} />
      </Stack>
    </SocketProvider>
  );
}
