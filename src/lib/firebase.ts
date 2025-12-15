// Firebase configuration
// Note: Replace dengan Firebase project credentials Anda
// Dapatkan dari: https://console.firebase.google.com

export const firebaseConfig = {
  // PENTING: Ganti dengan Firebase credentials Anda
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo_key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:000000000000:web:0000000000000000000000",
};
