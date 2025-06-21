/**
 * @file App.tsx
 * @fileoverview Appコンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * @author 守屋翼
 */

import './App.css'; // スタイルシートのインポート
import React, {useState, useEffect} from "react";
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import { addNoteToFirestore,  subscribeToNotes } from './services/firebase'; 
import { NoteData } from './types'; // NoteData型をインポート


/**
 * App関数コンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * 
 */

export default function App() {
  // useStateフックを使用して、ノートのデータを管理
  const [notes, setNotes] = useState<NoteData[]>([]);

  // --- アプリケーション起動時に付箋をリアルタイムで読み込む処理 ---
  useEffect(() => {
    // subscribeToNotes を呼び出し、リアルタイム監視を開始します。
    // データが変更されるたびに setNotes が呼び出され、State が更新されます。
    // Appコンポーネントがマウントされたとき、すなわちアプリケーションが起動したときに一度だけ実行されます。
    const unsubscribe = subscribeToNotes((fetchedNotes) => {
      setNotes(fetchedNotes);
    });

    // コンポーネントがアンマウントされる際に監視を停止します。
    return () => {
      unsubscribe();
    };
  }, []); // 空の依存配列 [] を渡すことで、コンポーネントがマウントされた時 (最初の一回だけ) 実行されるようにします。


    // --- 新しい付箋をデータベースに保存する司令塔 ---
  /**
   * 新しい付箋のテキストを受け取り、それを Firestore に保存します。
   * State (画面表示) の更新は、Firestore のリアルタイムリスナー (onSnapshot) が行います。
   * @param {string} text - 保存する付箋のテキスト内容。  
   */
  const handleSaveNewNote = async (text: string) => {
    // NoteData 型の新しい付箋オブジェクトを作成します。
    // Firestore がIDを生成
    const newNoteContent: Omit<NoteData, 'id'> = { text: text }; // ★★★ IDを含まないデータを作成します ★★★

    try {
      await addNoteToFirestore(newNoteContent); // Firestoreにノートを追加します。
    } catch (e) {
      console.error("Failed to save note:", e);
    }
  };

  const handleDeleteNote = (idToDelete: string) => {
    // State の更新は subscribeToNotes が行うため、ここでは不要になります。
    // setNotes((prevNotes) => prevNotes.filter((note) => note.id !== idToDelete)); 
    // Firebase からの削除処理をここに追加します ToDo
    console.log(`Attempting to delete note with ID: ${idToDelete}`);
  };

  

  return (
    <div className="App"> {/*後でAppを作ろうね*/}
      <h1>付箋アプリケーション</h1>
      <NoteInput onAddNote={handleSaveNewNote} /> {/* NoteInputコンポーネントをレンダリングし、ノート追加のコールバックを渡す */}

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


