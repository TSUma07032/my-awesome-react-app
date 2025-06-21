/**
 * @file App.tsx
 * @fileoverview Appコンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * @author 守屋翼
 */

import './App.css'; // スタイルシートのインポート
import React, {useState, useEffect} from "react";
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import { addNoteToFirestore, getNotesFromFirestore } from './services/firebase';
import { NoteData } from './types'; // NoteData型をインポート


/**
 * App関数コンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * 
 */

export default function App() {
  // useStateフックを使用して、ノートのデータを管理
  const [notes, setNotes] = useState<NoteData[]>([]);

  // コンポーネントがマウントされたときにFirestoreからノートを取得
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotesFromFirestore(); // Firestore から付箋データを取得します。
        setNotes(fetchedNotes); // 取得した付箋データを State に設定します。
      } catch (e) {
        // 読み込みに失敗した場合、コンソールにエラーを出力します。
        console.error("Failed to load notes:", e);
        // 必要に応じて、ユーザーにエラーを通知するUIを追加できます。
      }
    };
    fetchNotes(); // 関数を実行します。
  }, []); // 空の依存配列 [] を渡すことで、コンポーネントがマウントされた時 (最初の一回だけ) 実行されるようにします。

  // ノートを追加する関数
  const handleAddNote = async (text: string) => {
    // NoteData 型の新しい付箋オブジェクトを作成します。
    // Firestore がIDを生成
    const newNoteContent: Omit<NoteData, 'id'> = { text: text }; // ★★★ IDを含まないデータを作成します ★★★

    try {
      // addNoteToFirestore が Firestore が生成したID付きの NoteData を返します。
      const addedNote = await addNoteToFirestore(newNoteContent); // Firestoreに新しいノートを追加します。同時に、Firestoreから返ってくるIDを含むノートデータを取得します。
      setNotes((prevNotes) => [...prevNotes, addedNote]); // Firestoreから返ってきたID付きの付箋をStateに追加
    } catch (e) {
      console.error("Failed to save note:", e);
    }
  };

  // ノートの削除を処理する関数
  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id)); // 指定されたIDのノートを除外して新しい配列を作成
    // firebaseからの削除処理 ToDo
  };

  

  return (
    <div className="App"> {/*後でAppを作ろうね*/}
      <h1>付箋アプリケーション</h1>
      <NoteInput onAddNote={handleAddNote} /> {/* NoteInputコンポーネントをレンダリングし、ノート追加のコールバックを渡す */}

      <div className = "notes-list-container">{/* ノートのリストを表示するコンテナ */}
        {notes.map((note)=>( //mapメソッドを使用して、ノートの配列をループ処理
          <Note key={note.id} note={note} onDelete={handleDeleteNote} /> // 各ノートをNoteコンポーネントとしてレンダリング。key属性はReactのパフォーマンス最適化のために必要
        ))}
        {notes.length === 0 &&  // ノートがない場合のメッセージ
          <p>ノートがありません。新しいノートを追加してください。</p>}
      </div>
    </div>
  );  
}


