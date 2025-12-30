import { View, Text, FlatList, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSocket } from "@/context/SocketContext";

const Chat = () => {
  const { id, name } = useLocalSearchParams();
  const { messages, sendMessage } = useSocket();
  const [text, setText] = useState<string>("");

  const chatHistory = messages.filter(m => 
    m.sender === id || 
    (m.sender === 'ME' && m.receiverId === id)
  );
  const onSend = () => {
    if (text.trim().length === 0) return;
    sendMessage(id as string, text);
    setText('');
  };
  return (
    <>
    <Stack.Screen options={{headerTitle:name as string}}/>
    <View>
      {/* <Text>{name}</Text> */}
      <FlatList
        data={chatHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.sender === 'ME' ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender === 'ME' ? '#007AFF' : '#E5E5EA',
            padding: 10,
            margin: 5,
            borderRadius: 10
          }}>
            <Text style={{ color: item.sender === 'ME' ? 'white' : 'black' }}>
              {item.message}
            </Text>
          </View>
        )}
      />
      <TextInput value={text} onChangeText={setText} placeholder="Type message..." />
      <Button title="Send" onPress={onSend} />
    </View>
    </>
  );
};

export default Chat;
