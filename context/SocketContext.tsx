import { Config } from "@/constants/Config";
import {
  MessagePayload,
  OnlineUser,
  SocketContextType,
} from "@/interfaces/apiResponse";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface Prop {
  children: ReactNode;
  token: string;
}

export const SocketProvider = ({
  children,
  token,
}: Prop): React.JSX.Element => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    socket.current = new WebSocket(`${Config.apiSocketUrl}/ws?token=${token}`);

    socket.current.onopen = () => {
      setIsConnected(true);
      fetchOnlineUsers();
    };

    socket.current.onmessage = (e) => {
      const response = JSON.parse(e.data);

      if (response.action == "online_users") {
        setOnlineUsers(response.data);
      } else if (response.action == "new_message") {
        setMessages((prev) => [...prev, response]);
      }
    };

    socket.current.onclose = () => setIsConnected(false);

    return () => socket.current?.close();
  }, [token]);

  const fetchOnlineUsers = () => {
    socket.current?.send(JSON.stringify({ action: "get_online_users" }));
  };

  const sendMessage = (receiverId: string, text: string) => {
    const currentDate = new Date().toISOString();

    const payload = {
      action: "send_message",
      receiverId: receiverId,
      data: {
        message: text,
        currentDate: currentDate,
      },
    };

    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(payload));

      // Manually push your message to the state so you see it instantly
      const myMessage: MessagePayload = {
        action: "new_message",
        sender: "ME",
        receiverId: receiverId, // Track who this message was for
        message: text,
        messageTime: currentDate,
      };

      setMessages((prev) => [...prev, myMessage]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        messages,
        sendMessage,
        fetchOnlineUsers,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
