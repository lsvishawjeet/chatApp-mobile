import { authApiResponse } from "@/interfaces/apiResponse";
import { loginService } from "@/services/authService";
import { saveToken } from "@/utilities/authStore";
import { Stack, useRouter } from "expo-router";
import { ChevronRight, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const response: authApiResponse = await loginService(email, password);
      if (response.success && response.data.token) {
        await saveToken(response.data.token);
        router.replace("/(main)/users");
      } else {
        setError(response.message || "Login failed");
        setVisible(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          <View className="flex-1 justify-center py-12">
            {/* Header */}
            <View className="mb-10">
              <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-6 shadow-lg shadow-primary/40">
                <Text className="text-white text-3xl font-bold">C</Text>
              </View>
              <Text className="text-4xl font-bold text-text tracking-tight">
                Welcome back
              </Text>
              <Text className="text-muted mt-2 text-lg">
                Sign in to your account
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-5">
              <View>
                <Text className="mb-2 text-text font-medium ml-1">Email Address</Text>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-16 shadow-sm focus:border-primary">
                  <Mail size={20} color="#64748B" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="name@example.com"
                    placeholderTextColor="#94a3b8"
                    style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                    className="flex-1 ml-3 text-text text-base py-0 h-full"
                  />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-text font-medium ml-1">Password</Text>
                  <Pressable>
                    <Text className="text-primary font-semibold text-sm">Forgot?</Text>
                  </Pressable>
                </View>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-16 shadow-sm focus:border-primary">
                  <Lock size={20} color="#64748B" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 ml-3 text-text text-base"
                  />
                </View>
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`mt-4 h-16 rounded-2xl flex-row items-center justify-center shadow-md ${loading ? "bg-indigo-400" : "bg-primary"
                  }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">Sign In</Text>
                    <ChevronRight size={20} color="white" />
                  </>
                )}
              </Pressable>
            </View>

            {/* Footer */}
            <View className="mt-10 flex-row justify-center">
              <Text className="text-muted text-base">Don't have an account? </Text>
              <Pressable>
                <Text className="text-primary font-bold text-base">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{ borderRadius: 12, marginBottom: 20 }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

export default Login;