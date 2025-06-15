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
 * @example
 * const noteProps: NoteProps = {
 *   id: '12345',
 *  text: 'This is a note.'
 * }
 */
type NoteProps = {
    id: string;
    text: string;
}

/**
 * Note関数コンポーネントは、ノートの内容を表示するためのReactコンポーネントです。
 * @param {NoteProps} props - Noteコンポーネントに渡されるプロパティ。
 * @return {JSX.Element} - ノートの内容を表示するReact要素。
 * 
 * @example
 * <Note id="12345" text="This is a note." />
 */
export default function Note(props: NoteProps){
    return (
        <div className="note">
            <h2 className="note-id">ID: {props.id}</h2>
            <p className="note-text">{props.text}</p>
        </div>
    );
}

