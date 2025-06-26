import '../styles/Note.css';
import React from 'react';
import { NoteData } from '../types'; // NoteData型をインポート
import { useDraggable } from '@dnd-kit/core';

/**
 * @filename Note.tsx
 * @fileoverview Noteコンポーネントは、ノートの内容を表示するためのReactコンポーネントです。
 * @author 守屋翼
 */


/**
 * NotePropsは、Noteコンポーネントに渡されるプロパティの型定義です。
 * @typedef {Object} NoteProps
 * @property {string} id - ノートのユニークなID。
 * @property {string} text - ノートの内容。
 * @property {function} onDelete - ノート削除のためのコールバック関数。
 * @example
 * const noteProps: NoteProps = {
 *   id: '12345',
 *  text: 'This is a note.'
 *  onDelete: (id) => {
 *   console.log(`Note with ID ${id} deleted.`);
 *  }
 * }
 */
type NoteProps = {
    //id: string;
    //text: string;
    note : NoteData; // NoteData型を使用して、ノートのデータを受け取る
    onDelete: (id: string) => void; // ノート削除のためのコールバック関数
}

/**
 * Note関数コンポーネントは、ノートの内容を表示するためのReactコンポーネントです。
 * @param {NoteProps} props - Noteコンポーネントに渡されるプロパティ。
 * @return {JSX.Element} - ノートの内容を表示するReact要素。
 * 
 * @example
 * <Note id="12345" text="This is a note." />
 */
export default function Note({note, onDelete}: NoteProps){ /* 分割代入*/

    /*ノート削除handle */
    const handleDelete = () => {
        onDelete(note.id); // onDeleteコールバックを呼び出して、ノートを削除
    };

    // ドラッグ可能な要素の設定. 
    const { attributes, listeners, setNodeRef, transform,  isDragging } = useDraggable({
        id: note.id, //ドラッグするアイテムのユニークなID. note.idを使用
    });

    //transform はドラッグ中の要素の移動情報を保持する
    const style = {
        transform: transform ? `translate3d(${transform.x+note.x}px, ${transform.y+note.y}px, 0)` : `translate3d(${note.x}px, ${note.y}px, 0)`,
        position: 'absolute' as 'absolute', // 付箋を自由に配置するために必要！
        // ドラッグ中の透明度も調整
        opacity: isDragging ? 0.8 : 1, // ドラッグ中はちょっと透明にする
        zIndex: isDragging ? 1000 : 1, // ドラッグ中は一番手前に表示する
    };


    return (
        <div 
            className="note-container" 
            ref={setNodeRef} // ドラッグ可能な要素の参照を設定
            style={style} // ドラッグ中の位置を反映
            {...attributes} // ドラッグ可能な要素の属性を適用
            {...listeners} // ドラッグイベントのリスナーを適用
        >
             {/* ノートのコンテナ */}
            <div className="note">
                <h2 className="note-id">{note.text}</h2>
                <p className="note-text">ID: {note.id}</p>
            </div>
            <button className="delete-button" onClick={handleDelete}>
                削除
            </button>
        </div>
    );
}

