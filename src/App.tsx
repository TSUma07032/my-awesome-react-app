import { useState, useEffect } from 'react';
import './App.css'

import { db } from './firebaseConfig'; // <-- firebaseConfigをインポート
import { collection, addDoc, getDocs } from "firebase/firestore"; // <-- Firestoreの関数をインポート


function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // データ追加の関数
  const addMessage = async () => {
    try {
      // 'messages'っていうコレクションにデータを追加
      const docRef = await addDoc(collection(db, "messages"), {
        text: message,
        timestamp: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      setMessage(''); // 入力フィールドをクリア
      fetchMessages(); // 追加後に再取得して表示を更新
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // データ取得の関数
  const fetchMessages = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
    const fetchedMessages: string[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      fetchedMessages.push(doc.data().text); // textフィールドを取得
    });
    setMessages(fetchedMessages);
  };

  // コンポーネントがマウントされた時にメッセージを取得
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="App">
      <h1>Vite + React + Firebaseだぜぃ！🎉</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力！"
        />
        <button onClick={addMessage}>Firestoreに送信！</button>
      </div>
      <h2>保存されたメッセージ</h2>
      {messages.length === 0 ? (
        <p>まだメッセージがないぜ</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;