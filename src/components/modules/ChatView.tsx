"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Trash2,
  Plus,
  Settings,
  MoreVertical,
  Smile,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";

export function ChatComponent() {
  const [currentRoom, setCurrentRoom] = useState("general");
  const [inputValue, setInputValue] = useState("");
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showUserSettings, setShowUserSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    rooms,
    currentUser,
    currentUserName,
    loading,
    sendMessage,
    createRoom,
    deleteMessage,
    messagesEndRef,
    setCurrentUserName,
  } = useChat(currentRoom);

  // If currentRoom isn't present (e.g., Supabase UUIDs), switch to first room
  useEffect(() => {
    if (rooms && rooms.length > 0 && !rooms.some((r) => r.id === currentRoom)) {
      setCurrentRoom(rooms[0].id);
    }
  }, [rooms, currentRoom]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim()) {
      const roomId = await createRoom(newRoomName);
      setCurrentRoom(roomId);
      setNewRoomName("");
      setShowRoomSettings(false);
    }
  };

  const currentRoomData = rooms.find((r) => r.id === currentRoom);
  const roomMessages = messages;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("id-ID");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col bg-card">
        {/* User Info */}
        <div className="p-4 border-b border-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`}
                alt={currentUserName}
                width={40}
                height={40}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {currentUserName}
              </div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <button
              onClick={() => setShowUserSettings(!showUserSettings)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <Settings size={16} />
            </button>
          </motion.div>

          {/* User Settings */}
          {showUserSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <input
                type="text"
                placeholder="Nama pengguna baru"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded text-sm bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={() => {
                  if (newRoomName.trim()) {
                    setCurrentUserName(newRoomName);
                    setNewRoomName("");
                    setShowUserSettings(false);
                  }
                }}
                className="w-full h-8 text-sm"
              >
                Update
              </Button>
            </motion.div>
          )}
        </div>

        {/* Rooms Header */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className="font-bold text-sm">Ruang Obrolan</h2>
          <button
            onClick={() => setShowRoomSettings(!showRoomSettings)}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Create Room */}
        {showRoomSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 border-b border-border space-y-2"
          >
            <input
              type="text"
              placeholder="Nama ruang baru..."
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleCreateRoom();
              }}
              className="w-full px-3 py-2 border border-border rounded text-sm bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateRoom} className="flex-1 h-8 text-sm">
                Buat
              </Button>
              <Button
                onClick={() => {
                  setShowRoomSettings(false);
                  setNewRoomName("");
                }}
                variant="outline"
                className="flex-1 h-8 text-sm"
              >
                Batal
              </Button>
            </div>
          </motion.div>
        )}

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {rooms.map((room) => (
              <motion.button
                key={room.id}
                onClick={() => setCurrentRoom(room.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-border/50 last:border-0 ${
                  currentRoom === room.id
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-accent"
                }`}
              >
                <div className="font-medium text-sm">{room.name}</div>
                {room.lastMessage && (
                  <div className="text-xs text-muted-foreground truncate">
                    {room.lastMessage}
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <h1 className="text-xl font-bold">{currentRoomData?.name}</h1>
          <button className="p-2 hover:bg-accent rounded transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
          {roomMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Smile className="w-16 h-16 mb-4 opacity-50" />
              <p>Mulai percakapan! Kirim pesan pertama Anda.</p>
            </div>
          ) : (
            <>
              {roomMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.sender === currentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={msg.avatar || ""}
                      alt={msg.senderName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>

                  <div
                    className={`flex flex-col gap-1 max-w-xs ${
                      msg.sender === currentUser ? "items-end" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-sm font-semibold">
                        {msg.senderName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-lg break-words ${
                        msg.sender === currentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.message}
                    </div>

                    {msg.sender === currentUser && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ketik pesan..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
