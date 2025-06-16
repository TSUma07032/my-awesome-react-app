/**
 * @file App.tsx
 * @fileoverview Appコンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * @author 守屋翼
 */

import React, {useState} from "react";
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import generateUniqueId  from './utils/idGenerator';

/**
 * NoteDataは、ノートのデータを表す型定義です。
 * * @property {string} id - ノートのユニークなID。
 * * @property {string} text - ノートの内容。
 * @example
 *  ToDo
 */
type NoteData = {
    id: string; // ノートのユニークなID
    text: string; // ノートの内容
};


/**
 * App関数コンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * 
 */

export default function App() {
  // useStateフックを使用して、ノートのデータを管理
  const [notes, setNotes] = useState<NoteData[]>([]);

  // ノートを追加する関数
  // NoteInputコンポーネントから呼び出される前提のため、あっちで定義されているonAddNote関数を実装
  const handleAddNote = (text: string) => {
    // 新しいノートのデータを作成
    const newNote: NoteData = {
      id: generateUniqueId(), // ユニークなIDを生成
      text: text // 入力されたテキストを設定
    }
    setNotes(prevNotes => [...prevNotes, newNote]); // 既存のノートに新しいノートを追加。イミュータブルかつコールバックです
  }

  return (
    <div className="App"> {/*後でAppを作ろうね*/}
      <h1>付箋アプリケーション</h1>
      <NoteInput onAddNote={handleAddNote} /> {/* NoteInputコンポーネントをレンダリングし、ノート追加のコールバックを渡す */}

      <div className = "notes-list-countainer">{/* ノートのリストを表示するコンテナ */}
        {notes.map((note)=>( //mapメソッドを使用して、ノートの配列をループ処理
          <Note key={note.id} id={note.id} text={note.text} /> // 各ノートをNoteコンポーネントとしてレンダリング。key属性はReactのパフォーマンス最適化のために必要
        ))}
        {notes.length === 0 &&  // ノートがない場合のメッセージ
          <p>ノートがありません。新しいノートを追加してください。</p>}
      </div>
    </div>
  );  
}


