/**
 * @file App.tsx
 * @fileoverview Appコンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * @author 守屋翼
 */

import './App.css'; // スタイルシートのインポート
import React, {useState} from "react";
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import generateUniqueId  from './utils/idGenerator';
import { addNoteToFirestore } from './services/firebase';
import { NoteData } from './types'; // NoteData型をインポート


/**
 * App関数コンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * 
 */

export default function App() {
  // useStateフックを使用して、ノートのデータを管理
  const [notes, setNotes] = useState<NoteData[]>([]);

  // ノートを追加する関数
  // NoteInputコンポーネントから呼び出される前提のため、あっちで定義されているonAddNote関数を実装
  const handleAddNote = async (text: string) => {
    // 新しいノートのデータを作成
    const newNote: NoteData = {
      id: generateUniqueId(), // ユニークなIDを生成
      text: text // 入力されたテキストを設定
    }
    setNotes(prevNotes => [...prevNotes, newNote]); // 既存のノートに新しいノートを追加。イミュータブルかつコールバックです

    try {
      await addNoteToFirestore(newNote);
    } catch (e) {
      console.error("付箋の保存に失敗");
      // ユーザーへの通知 ToDo
    }
  }

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


