import { useSocket } from "@/context/SocketContext";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera, Send } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  const { id, name } = useLocalSearchParams();
  const { messages, sendMessage } = useSocket();
  const [text, setText] = useState<string>("");
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const chatHistory = messages.filter(m =>
    m.sender === id ||
    (m.sender === 'ME' && m.receiverId === id)
  );

  const onSend = () => {
    if (text.trim().length === 0) return;
    sendMessage(id as string, text, "text");
    setText('');
  };

  const getInitials = (userName: string) => {
    if (!userName) return "";
    return userName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageAction = async (useCamera: boolean) => {
    // Request permissions
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert(`Permission to access ${useCamera ? 'camera' : 'gallery'} is required!`);
      return;
    }

    const result = await (useCamera
      ? ImagePicker.launchCameraAsync({
        // allowsEditing: true,
        quality: 0.4,
        base64: true,
      })
      : ImagePicker.launchImageLibraryAsync({
        // allowsEditing: true,:
        quality: 0.4,
        base64: true,
      }));

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      sendMessage(id as string, base64Image, 'image');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100 shadow-sm z-10">
        <Pressable onPress={() => router.back()} className="mr-3 p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft size={24} color="#1E293B" />
        </Pressable>

        <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
          <Text className="text-primary font-bold text-sm">{getInitials(name as string)}</Text>
        </View>

        <View>
          <Text className="text-text font-bold text-lg leading-tight">{name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        className="flex-1"
      >
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.sender === 'ME';
            return (
              <View
                className={`max-w-[80%] mb-3 p-4 rounded-2xl ${isMe
                  ? 'bg-primary self-end rounded-tr-sm'
                  : 'bg-white self-start rounded-tl-sm border border-slate-100 shadow-sm'
                  }`}
              >
                {item.type === 'image' ? (
                  <Image
                    source={{ uri: item.message }}
                    style={{ width: 200, height: 200, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className={`text-base ${isMe ? 'text-white' : 'text-slate-700'}`}>
                    {item.message}
                  </Text>
                )}
              </View>
            );
          }}
        />

        {/* Input Area */}
        <View className="p-4 bg-white border-t border-slate-100">
          <View className="flex-row items-center gap-3">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              multiline
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-text max-h-32"
              style={{ includeFontPadding: false, textAlignVertical: 'center' }}
            />
            <Pressable
              onPress={() => handleImageAction(true)}
              className={`w-12 h-12 rounded-full items-center justify-center shadow-sm bg-primary`}
            >
              <Camera size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={onSend}
              disabled={text.trim().length === 0}
              className={`w-12 h-12 rounded-full items-center justify-center shadow-sm ${text.trim().length > 0 ? 'bg-primary' : 'bg-slate-200'
                }`}
            >
              <Send size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
