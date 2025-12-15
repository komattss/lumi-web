# Chat App - Setup Guide

## Implementasi Saat Ini

Chat App Lumi menggunakan **localStorage** sebagai penyimpanan lokal untuk demo real-time messaging. Ini memungkinkan pengalaman chat langsung tanpa setup backend.

### Fitur Chat:

- ✅ Real-time messaging dengan localStorage
- ✅ Multiple chat rooms
- ✅ User profiles dengan avatar otomatis
- ✅ Timestamp dan message history
- ✅ Delete messages
- ✅ Create new rooms
- ✅ Change username

---

## Setup Firebase (Opsional)

Jika ingin menggunakan Firebase untuk penyimpanan cloud dan real-time database:

### 1. Buat Firebase Project

- Kunjungi https://console.firebase.google.com
- Klik "Add project"
- Isi nama project (contoh: "lumi-chat")
- Ikuti wizard setup

### 2. Setup Authentication

- Di Firebase Console, pilih "Authentication"
- Klik "Get Started"
- Aktifkan "Anonymous Authentication" atau "Google Sign-in"

### 3. Setup Realtime Database

- Di Firebase Console, pilih "Realtime Database"
- Klik "Create Database"
- Pilih lokasi server
- Mulai dalam mode test (untuk development)
- Klik "Enable"

### 4. Setup Firestore (Alternatif)

- Di Firebase Console, pilih "Firestore Database"
- Klik "Create Database"
- Pilih lokasi server
- Mulai dalam mode test
- Klik "Enable"

### 5. Dapatkan Config Firebase

- Di Firebase Console, buka "Project Settings" (gear icon)
- Scroll ke "Your apps"
- Klik "Web" untuk menambah aplikasi web
- Copy Firebase SDK config

### 6. Update .env.local

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 7. Install Firebase Package

```bash
npm install firebase
```

### 8. Update useChat Hook untuk Firebase (Realtime Database)

Ganti `src/hooks/useChat.ts` dengan:

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "firebase/database";
import { firebaseConfig } from "@/lib/firebase";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: number;
  avatar?: string;
}

export function useChat(roomId: string = "general") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
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

    // Listen to messages
    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !currentUser) return;

      const newMessage: ChatMessage = {
        id: "",
        sender: currentUser,
        senderName: currentUserName,
        message: text.trim(),
        timestamp: Date.now(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`,
      };

      const messagesRef = ref(database, `rooms/${roomId}/messages`);
      push(messagesRef, newMessage);
    },
    [currentUser, currentUserName, roomId]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      const messageRef = ref(database, `rooms/${roomId}/messages/${messageId}`);
      remove(messageRef);
    },
    [roomId]
  );

  return {
    messages,
    currentUser,
    currentUserName,
    loading,
    sendMessage,
    deleteMessage,
    messagesEndRef,
    setCurrentUserName,
  };
}
```

### 9. Firestore Rules (untuk test mode - jangan gunakan di production)

Di Firestore, perbarui rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{room}/messages/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 10. Realtime Database Rules (untuk test mode)

Di Realtime Database, perbarui rules:

```json
{
  "rules": {
    "rooms": {
      "$room": {
        "messages": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

---

## Deployment Checklist

Sebelum production:

1. ✅ Ubah Firebase Security Rules
2. ✅ Setup Firebase Authentication
3. ✅ Enable rate limiting
4. ✅ Setup CORS jika diperlukan
5. ✅ Test dengan multiple users
6. ✅ Setup backup database

---

## Troubleshooting

**Chat tidak update real-time:**

- Pastikan Firebase credentials benar di `.env.local`
- Cek Firebase rules mengizinkan read/write
- Buka browser console untuk error messages

**Error "Firebase is not initialized":**

- Pastikan Firebase package terinstall: `npm install firebase`
- Pastikan environment variables benar

**Messages tidak tersimpan:**

- Cek Firebase Realtime Database structure
- Pastikan database rules mengizinkan write operations
