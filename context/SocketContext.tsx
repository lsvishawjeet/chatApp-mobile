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

  const webSocketConnect = () => {
    if (!token) return;
    if (socket.current) {
      socket.current.close();
    }
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
  }

  useEffect(() => {
    const cleanup = webSocketConnect();
    return cleanup;
  }, [token]);

  const fetchOnlineUsers = () => {
    socket.current?.send(JSON.stringify({ action: "get_online_users" }));
  };

  const sendMessage = async (receiverId: string, content: string, type: "text" | "image" = "text") => {
    console.log("Attempting to send message. Socket State:", socket.current?.readyState);

    if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
      if (socket.current?.readyState === WebSocket.CONNECTING) {
        console.log("Socket is connecting, waiting...");
      } else {
        console.log("Socket disconnected (State: " + socket.current?.readyState + "), reconnecting...");
        webSocketConnect();
      }

      try {
        await new Promise<void>((resolve, reject) => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (socket.current?.readyState === WebSocket.OPEN) {
              console.log("Socket connected successfully during wait.");
              clearInterval(interval);
              resolve();
            }
            if (attempts > 50) { // 5 seconds
              clearInterval(interval);
              reject(new Error("Socket connection timeout. State: " + socket.current?.readyState));
            }
          }, 100);
        });
      } catch (e) {
        console.error("Reconnection failed:", e);
        return false;
      }
    }

    const currentDate = new Date().toISOString();

    const payload = {
      action: "send_message",
      receiverId: receiverId,
      data: {
        message: content,
        type: type,
        currentDate: currentDate,
      },
    };

    if (socket.current?.readyState === WebSocket.OPEN) {
      try {
        console.log("Sending message payload...");
        socket.current.send(JSON.stringify(payload));
        console.log("Message sent to socket.");

        const myMessage: MessagePayload = {
          action: "new_message",
          sender: "ME",
          receiverId: receiverId,
          message: content,
          type: type,
          messageTime: currentDate,
        };

        setMessages((prev) => [...prev, myMessage]);
        return true;
      } catch (error) {
        console.error("Socket send error:", error);
        return false;
      }
    } else {
      console.warn("Socket is not OPEN after wait. Current state:", socket.current?.readyState);
      return false;
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
