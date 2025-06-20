// src/services/firebase.ts
import { initializeApp } from "firebase/app"; // Firebaseの初期化関数
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestoreを使うための関数
import { NoteData } from "../types"; // NoteData型をインポート

/**
 * @fileoverview Firebase SDKの初期化とFirestoreインスタンス
 * @author 守屋翼
 */

// Firebaseの設定情報。.envファイルから読み込む
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreデータベースのインスタンスを取得してエクスポート
// Firestoreにアクセス
export const db = getFirestore(app);

/**
 * 
 */
export const addNoteToFirestore = async (noteData: NoteData) => {
  try {
    // 'notes' という名前のコレクションにデータを追加
    const docRef = await addDoc(collection(db, "notes"), noteData);
    console.log("Firestoreに保存.ドキュメントID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Firestoreへの保存エラー:", e);
    throw e; // エラーを再スローして、呼び出し元に伝える
  }
};
