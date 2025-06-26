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
import { DndProvider, useDrag, useDrop  } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/*
* クラス内のレイアウト定義
*/
const dragStyle = {
  cursor: 'move', // ドラッグ中のカーソルスタイル
  opacity: 0.5, // ドラッグ中の透明度
};


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

  // useDrag フックを使用して、ドラッグ可能なアイテムを定義します。
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'note', // ドラッグするアイテムのタイプを指定
    item: { id: 'note' }, // ドラッグするアイテムのデータを指定
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // ドラッグ中かどうかを監視.おまじない的に使う
    }),
  }));

  // useDrop フックを使用して、ドロップ可能な領域を定義します。
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'note', // ドロップ可能なアイテムのタイプを指定
    drop: (item: { id: string }) => { // { id: string } 型のアイテムを受け取る
      console.log(`Dropped item with ID: ${item.id}`); // ドロップされたアイテムのIDをログに出力
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // ドロップ領域にアイテムが重なっているかどうかを監視. おまじない的に使う
    }),
  }));


    // --- 新しい付箋をデータベースに保存する司令塔 ---
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
    <DndProvider backend={HTML5Backend}> {/* ドラッグ＆ドロップのためのプロバイダーを設定 */}
      <div className="App"> {/*後でAppを作ろうね*/}
        <h1>付箋アプリケーション</h1>
        <NoteInput onAddNote={handleSaveNewNote} /> {/* NoteInputコンポーネントをレンダリングし、ノート追加のコールバックを渡す */}

        { drag( <div
          className = "notes-list-container"
          style = {{...dragStyle, backgroundColor: isOver ? '#f0f0f0' : '#fff'}} // ドロップ領域のスタイルを設定
        >{/* ノートのリストを表示するコンテナ */}
          {notes.map((note)=>( //mapメソッドを使用して、ノートの配列をループ処理
            <Note 
              key={note.id} 
              note={note} 
              onDelete={handleDeleteNote} /> 
          ))}
          {notes.length === 0 &&  // ノートがない場合のメッセージ
            <p>ノートがありません。新しいノートを追加してください。</p>}
        </div>
        )}
      </div>
    </DndProvider>
  );  
}


