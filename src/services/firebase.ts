// src/services/firebase.ts
import { initializeApp } from "firebase/app"; // Firebaseの初期化関数
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  QueryDocumentSnapshot, 
  QuerySnapshot, 
  DocumentData  } from "firebase/firestore"; // Firestoreを使うための関数
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

// --- 新規追加：コレクション名を定数として定義します ---
/**
 * Firestore の付箋コレクション名です。
 * @constant {string}
 */
const NOTES_COLLECTION_NAME = "notes"; // ★★★ コレクション名を定数として宣言します ★★★


/**
 * 
 */
export const addNoteToFirestore = async (noteContent: Omit<NoteData,"id">) => {
  try {
    // 'notes' という名前のコレクションにデータを追加
    const docRef = await addDoc(collection(db, NOTES_COLLECTION_NAME), noteContent);
    const noteWithId: NoteData = { ...noteContent, id: docRef.id }; // FirestoreのドキュメントIDを付箋データに追加
    console.log("Firestoreに保存.ドキュメントID:", docRef.id);
    return noteWithId; // IDを付与した付箋データを返す
  } catch (e) {
    console.error("Firestoreへの保存エラー:", e);
    throw e; // エラーを再スローして、呼び出し元に伝える
  }
};

// --- 新規追加：Firestore から付箋データを読み込む関数 ---
/**
 * Firestore から全ての付箋データを読み込みます。
 * 各ドキュメントのデータには、Firestoreが自動生成するドキュメントIDも含まれます。
 * @returns {Promise<NoteData[]>} 付箋データの配列を解決するPromise。
 */
export const getNotesFromFirestore = async (): Promise<NoteData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, NOTES_COLLECTION_NAME)); // 'notes' コレクションから全てのドキュメントを取得します。
    const notes: NoteData[] = [];
    querySnapshot.forEach((doc) => {
      // 各ドキュメントのデータ (doc.data()) とFirestoreのドキュメントID (doc.id) を結合し、NoteData 型として配列に追加します。
      // NoteData の id と text 以外に Firestore のデータに他のプロパティがある場合も、as NoteData で型アサーションしています。
      notes.push({ id: doc.id, ...doc.data() } as NoteData); 
    });
    // 読み込みが成功した場合、コンソールに取得した付箋データを出力します。
    console.log("Notes successfully fetched from Firestore:", notes);
    return notes;
  } catch (e) {
    // エラーが発生した場合、コンソールに出力し、呼び出し元に伝播させます。
    console.error("Error fetching notes from Firestore:", e);
    throw e;
  }
};


export const subscribeToNotes = (callback: (notes: NoteData[]) => void): () => void => {
  const notesCollection = collection(db, NOTES_COLLECTION_NAME);
  // クエリを作成 クエリの性質上条件を追加できるが、ここでは全てのドキュメントを取得するために条件は指定しない
  const q = query(notesCollection); 

  // onSnapshot を使用してリアルタイム監視を開始します。
  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const notes: NoteData[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      // ドキュメントデータとIDを結合して NoteData 型として追加します。
      notes.push({ id: doc.id, ...doc.data() } as NoteData);
    });
    // 変更された付箋データのリストをコールバック関数に渡します。
    callback(notes); 
  }, (error) => {
    // エラーが発生した場合、コンソールに出力します。
    console.error("Error subscribing to notes:", error);
  });

  // 監視を停止するための関数を返します (useEffect のクリーンアップに利用)。
  return unsubscribe; 
};