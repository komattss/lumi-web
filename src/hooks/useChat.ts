"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

// Supabase-backed chat with graceful fallback to localStorage when not configured
export function useChat(roomId: string = "general") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const usingSupabase = isSupabaseConfigured;
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Initialize chat
  useEffect(() => {
    let isMounted = true;
    const initChat = async () => {
      // Get or create local user identity (used in both modes)
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

      if (usingSupabase) {
        try {
          // Ensure default rooms exist or load rooms from DB
          const { data: roomsData, error: roomsErr } = await supabase
            .from("rooms")
            .select("id,name,last_message,last_message_time")
            .order("created_at", { ascending: true });

          if (roomsErr) throw roomsErr;

          if (!roomsData || roomsData.length === 0) {
            // seed default rooms
            const defaults = [
              { name: "🌍 General" },
              { name: "🎲 Random" },
              { name: "💻 Tech" },
            ];
            const { data: inserted, error: insertErr } = await supabase
              .from("rooms")
              .insert(defaults)
              .select("id,name");
            if (insertErr) throw insertErr;
            setRooms(
              (inserted || []).map((r: any) => ({
                id: r.id,
                name: r.name,
                members: [],
              }))
            );
          } else {
            setRooms(
              roomsData.map((r: any) => ({
                id: String(r.id),
                name: r.name,
                members: [],
                lastMessage: r.last_message ?? undefined,
                lastMessageTime: r.last_message_time
                  ? new Date(r.last_message_time).getTime()
                  : undefined,
              }))
            );
          }

          // Load messages for this room
          await loadMessagesSupabase(roomId);

          // Subscribe to realtime inserts/deletes for this room
          // Subscribe to realtime inserts/deletes for this room
          const channel = supabase
            .channel(`room-${roomId}`)
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `room_id=eq.${roomId}`,
              },
              (payload: any) => {
                const m = payload.new;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: m.id,
                    sender: m.sender,
                    senderName: m.sender_name,
                    message: m.message,
                    timestamp: new Date(m.created_at).getTime(),
                    avatar: m.avatar || undefined,
                  },
                ]);
              }
            )
            .on(
              "postgres_changes",
              {
                event: "DELETE",
                schema: "public",
                table: "messages",
                filter: `room_id=eq.${roomId}`,
              },
              (payload: any) => {
                setMessages((prev) =>
                  prev.filter((m) => m.id !== payload.old.id)
                );
              }
            )
            .subscribe();

          // Keep reference for cleanup
          channelRef.current = channel;
        } catch (e) {
          console.warn(
            "Supabase not available or schema missing, using localStorage fallback.",
            e
          );
          // fallback to localStorage
          loadRoomsLocal();
          loadMessagesLocal(roomId);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        // fallback to localStorage
        loadRoomsLocal();
        loadMessagesLocal(roomId);
        if (isMounted) setLoading(false);
      }
    };

    initChat();
    return () => {
      // cleanup realtime channel if any
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, usingSupabase]);

  const loadMessagesLocal = (room: string) => {
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

  const loadRoomsLocal = () => {
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
  };

  const loadMessagesSupabase = async (room: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender, sender_name, message, avatar, created_at")
        .eq("room_id", room)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages(
        (data || []).map((m: any) => ({
          id: m.id,
          sender: m.sender,
          senderName: m.sender_name,
          message: m.message,
          timestamp: new Date(m.created_at).getTime(),
          avatar: m.avatar || undefined,
        }))
      );
    } catch (e) {
      console.error("Failed to load messages from Supabase", e);
      setMessages([]);
    }
  };

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUser) return;

      const base = {
        sender: currentUser,
        senderName: currentUserName,
        message: text.trim(),
        timestamp: Date.now(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`,
      };

      if (usingSupabase) {
        try {
          const { error } = await supabase.from("messages").insert({
            room_id: roomId,
            sender: base.sender,
            sender_name: base.senderName,
            message: base.message,
            avatar: base.avatar,
          });
          if (error) throw error;
          // Update room last message
          await supabase
            .from("rooms")
            .update({
              last_message: base.message,
              last_message_time: new Date().toISOString(),
            })
            .eq("id", roomId);
        } catch (e) {
          console.error(
            "Failed to send message via Supabase, falling back to local.",
            e
          );
          // fallback to local update to not lose message UX
          const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            ...base,
          } as ChatMessage;
          const updated = [...messages, newMessage];
          setMessages(updated);
          localStorage.setItem(
            `chatMessages_${roomId}`,
            JSON.stringify(updated)
          );
          updateRoomLastMessageLocal(roomId, base.message);
        }
      } else {
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          ...base,
        } as ChatMessage;
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem(
          `chatMessages_${roomId}`,
          JSON.stringify(updatedMessages)
        );
        updateRoomLastMessageLocal(roomId, base.message);
      }
    },
    [messages, currentUser, currentUserName, roomId, usingSupabase]
  );

  const updateRoomLastMessageLocal = (room: string, message: string) => {
    const updatedRooms = rooms.map((r) =>
      r.id === room
        ? { ...r, lastMessage: message, lastMessageTime: Date.now() }
        : r
    );
    setRooms(updatedRooms);
    localStorage.setItem("chatRooms", JSON.stringify(updatedRooms));
  };

  const createRoom = useCallback(
    async (roomName: string) => {
      if (usingSupabase) {
        try {
          const { data, error } = await supabase
            .from("rooms")
            .insert({ name: roomName })
            .select("id,name")
            .single();
          if (error) throw error;
          const newRoom: ChatRoom = {
            id: String(data.id),
            name: data.name,
            members: [],
          };
          setRooms((prev) => [...prev, newRoom]);
          return newRoom.id;
        } catch (e) {
          console.error(
            "Failed to create room in Supabase, falling back to local.",
            e
          );
        }
      }
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
    [rooms, usingSupabase]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (usingSupabase) {
        try {
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("id", messageId);
          if (error) throw error;
          // state will be updated by realtime DELETE
          return;
        } catch (e) {
          console.error(
            "Failed to delete message in Supabase, falling back to local.",
            e
          );
        }
      }
      const updatedMessages = messages.filter((m) => m.id !== messageId);
      setMessages(updatedMessages);
      const key = `chatMessages_${roomId}`;
      localStorage.setItem(key, JSON.stringify(updatedMessages));
    },
    [messages, roomId, usingSupabase]
  );

  const clearMessages = useCallback(async () => {
    if (usingSupabase) {
      try {
        const { error } = await supabase
          .from("messages")
          .delete()
          .eq("room_id", roomId);
        if (error) throw error;
        setMessages([]);
        return;
      } catch (e) {
        console.error(
          "Failed to clear messages in Supabase, falling back to local.",
          e
        );
      }
    }
    setMessages([]);
    const key = `chatMessages_${roomId}`;
    localStorage.removeItem(key);
  }, [roomId, usingSupabase]);

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
