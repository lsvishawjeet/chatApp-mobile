interface Data {
    token: string,
    user: {
        name: string,
        email: string,
        _id:  string
    }
}

export interface User {
    name: string,
    email: string,
    _id:  string
}

export interface authApiResponse {
    data:Data,
    message: string,
    success: boolean
}

export interface allUsersApiResponse {
    data : User[],
    message: string,
    success: boolean
}
export interface OnlineUser {
  userId: string;
  email: string;
  name: string;
}

export interface MessagePayload {
  action: 'new_message';
  sender: string;
  receiverId?: string; // to track who we sent it to
  message: string;
  messageTime: string;
}

export interface SocketContextType {
  onlineUsers: OnlineUser[];
  messages: MessagePayload[];
  isConnected: boolean;
  sendMessage: (receiverId: string, text: string) => void;
  fetchOnlineUsers: () => void;
}