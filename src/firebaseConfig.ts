// src/firebaseConfig.ts (例)
import { initializeApp } from "firebase/app";
// 使いたいFirebaseサービスを追加する
// 例：Firestoreを使いたいなら
import { getFirestore } from "firebase/firestore";
// 例：認証を使いたいなら
import { getAuth } from "firebase/auth";

// Firebaseコンソールからコピーした設定情報をここにペーストする
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Firebaseを初期化する
const app = initializeApp(firebaseConfig);

// 使いたいFirebaseサービスを初期化してエクスポート
// 例：Firestore
export const db = getFirestore(app);
// 例：Auth
export const auth = getAuth(app);

// 必要に応じて、app自体もエクスポートしておくと便利
export default app;