import '../styles/Note.css';
import React from 'react';

/**
 * @filename Note.tsx
 * @fileoverview Noteコンポーネントは、ノートの内容を表示するためのReactコンポーネントです。
 * @author 守屋翼
 */


/**
 * NotePropsは、Noteコンポーネントに渡されるプロパティの型定義です。
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
    id: string;
    text: string;
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
export default function Note({id, text, onDelete}: NoteProps){ /* 分割代入*/

    /*ノート削除handle */
    const handleDelete = () => {
        onDelete(id); // onDeleteコールバックを呼び出して、ノートを削除
    };

    return (
        <div className="note-container">
             {/* ノートのコンテナ */}
            <div className="note">
                <h2 className="note-id">{text}</h2>
                <p className="note-text">ID: {id}</p>
            </div>
            <button className="delete-button" onClick={handleDelete}>
                削除
            </button>
        </div>
    );
}

