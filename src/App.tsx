/**
 * @file App.tsx
 * @fileoverview Appコンポーネントは、ノートアプリケーションのメインコンポーネントで、ノートの追加と表示を管理します。
 * @author 守屋翼
 */

import './App.css'; // スタイルシートのインポート
import React, {useState, useEffect} from "react";
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import { addNoteToFirestore, subscribeToNotes, updateNotePositionInFirestore } from './services/firebase'; 
import { NoteData } from './types'; // NoteData型をインポート
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { HTML5Backend } from 'react-dnd-html5-backend';

/*
* クラス内のレイアウト定義
*/

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
  const handleSaveNewNote = async (text: string) => {
    // NoteData 型の新しい付箋オブジェクトを作成します。
    // Firestore がIDを生成
    const newNoteContent: Omit<NoteData, 'id'> = { text: text, x: 0, y: 0 }; // Omitを使用してidを除外します。

    try {
      await addNoteToFirestore(newNoteContent); // Firestoreにノートを追加します。
    } catch (e) {
      console.error("Failed to save note:", e);
    }
  };

  const handleDeleteNote = (idToDelete: string) => {
    // Firebase からの削除処理をここに追加します ToDo
    console.log(`Attempting to delete note with ID: ${idToDelete}`);
  };

  // ドラッグ終了時の処理を定義します。
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event; // active はドラッグ中のアイテム、delta は移動量

    // ドラッグされた付箋の ID を取得する
    const draggedNoteId = active.id.toString(); // dnd-kit の id は string | number なので、string に変換

    // 現在の State からドラッグされた付箋を見つける
    const currentNote = notes.find(note => note.id === draggedNoteId);

    if (currentNote) {
      // 新しい位置を計算する
      const newX = currentNote.x + delta.x;
      const newY = currentNote.y + delta.y;

      // State を更新する(optimistic update: まず画面を更新して、後で DB を更新する)
      setNotes(prevNotes => 
        prevNotes.map(note =>
          note.id === draggedNoteId ? { ...note, x: newX, y: newY } : note
        )
      );

      // Firestore の位置情報を更新するニャ！
      try {
        await updateNotePositionInFirestore(draggedNoteId, newX, newY);
      } catch (e) {
        console.error(`Failed to update note position in Firestore for ${draggedNoteId}:`, e);
        // エラーが発生したら、State を元に戻すロジックが必要になるかもニャ！ (上級編)
      }
    }
  };
  

  return (
    <DndContext onDragEnd = {handleDragEnd} >
      <div className="App"> {/*後でAppを作ろうね*/}
        <h1>付箋アプリケーション</h1>
        <NoteInput onAddNote={handleSaveNewNote} /> {/* NoteInputコンポーネントをレンダリングし、ノート追加のコールバックを渡す */}
        <div
          className = "notes-list-container"
        >{/* ノートのリストを表示するコンテナ */}
          {notes.map((note)=>( //mapメソッドを使用して、ノートの配列をループ処理
            <Note 
              key={note.id} 
              note={note} 
              onDelete={handleDeleteNote} 
              /> 
          ))}
          {notes.length === 0 &&  // ノートがない場合のメッセージ
            <p>ノートがありません。新しいノートを追加してください。</p>}
        </div>
      </div>
    </DndContext>
  );  
}


