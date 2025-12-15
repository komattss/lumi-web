"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: number;
  avatar?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  members: string[];
  lastMessage?: string;
  lastMessageTime?: number;
}

// Simulasi Firebase Realtime Database menggunakan localStorage
export function useChat(roomId: string = "general") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    const initChat = () => {
      // Get atau create user
      const userId = localStorage.getItem("chatUserId");
      const userName = localStorage.getItem("chatUserName");

      if (!userId) {
        const newUserId = `user_${Date.now()}`;
        const newUserName = `User${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem("chatUserId", newUserId);
        localStorage.setItem("chatUserName", newUserName);
        setCurrentUser(newUserId);
        setCurrentUserName(newUserName);
      } else {
        setCurrentUser(userId);
        setCurrentUserName(userName || "Anonymous");
      }

      // Load rooms
      const storedRooms = localStorage.getItem("chatRooms");
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      } else {
        const defaultRooms: ChatRoom[] = [
          { id: "general", name: "🌍 General", members: [] },
          { id: "random", name: "🎲 Random", members: [] },
          { id: "tech", name: "💻 Tech", members: [] },
        ];
        localStorage.setItem("chatRooms", JSON.stringify(defaultRooms));
        setRooms(defaultRooms);
      }

      // Load messages
      loadMessages(roomId);
      setLoading(false);
    };

    initChat();
  }, [roomId]);

  const loadMessages = (room: string) => {
    const key = `chatMessages_${room}`;
    const storedMessages = localStorage.getItem(key);
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !currentUser) return;

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: currentUser,
        senderName: currentUserName,
        message: text.trim(),
        timestamp: Date.now(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`,
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Save to localStorage
      const key = `chatMessages_${roomId}`;
      localStorage.setItem(key, JSON.stringify(updatedMessages));

      // Update room last message
      updateRoomLastMessage(roomId, text.trim());
    },
    [messages, currentUser, currentUserName, roomId]
  );

  const updateRoomLastMessage = (room: string, message: string) => {
    const updatedRooms = rooms.map((r) =>
      r.id === room
        ? { ...r, lastMessage: message, lastMessageTime: Date.now() }
        : r
    );
    setRooms(updatedRooms);
    localStorage.setItem("chatRooms", JSON.stringify(updatedRooms));
  };

  const createRoom = useCallback(
    (roomName: string) => {
      const newRoom: ChatRoom = {
        id: `room_${Date.now()}`,
        name: roomName,
        members: [],
      };
      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      localStorage.setItem("chatRooms", JSON.stringify(updatedRooms));
      return newRoom.id;
    },
    [rooms]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      const updatedMessages = messages.filter((m) => m.id !== messageId);
      setMessages(updatedMessages);
      const key = `chatMessages_${roomId}`;
      localStorage.setItem(key, JSON.stringify(updatedMessages));
    },
    [messages, roomId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    const key = `chatMessages_${roomId}`;
    localStorage.removeItem(key);
  }, [roomId]);

  return {
    messages,
    rooms,
    currentUser,
    currentUserName,
    loading,
    sendMessage,
    createRoom,
    deleteMessage,
    clearMessages,
    messagesEndRef,
    setCurrentUserName,
  };
}
