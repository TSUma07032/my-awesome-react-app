/**
 * @filename NoteInput.tsx
 * @fileoverview NoteInputコンポーネントは、入力されたテキストを表示するためのReactコンポーネントです。
 * @author 守屋翼
 */

import React, {useState} from 'react';

/*一旦空。後でやる */
type NoteInputProps = {};


/**
 * NoteInput関数コンポーネントは、入力されたテキストを表示するためのReactコンポーネントです。
 * @param {NoteInputProps} props - NoteInputコンポーネントに渡されるプロパティ。
 * @return {JSX.Element} - 入力されたテキストを表示するReact要素。
 * 
 * @example
 * ToDo
 * 
 */
export default function NoteInput() {

    // useStateフックを使用して、入力されたテキストを管理
    const [inputText, setInputText] = useState('');

    // 入力テキストの変更を処理する関数
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault(); // デフォルトのフォーム送信を防ぐ
        setInputText(event.target.value); // 入力されたテキストを更新

    };


    return (
        <div className="note-input-container">{/*コンテナ用のクラス*/}
            <input
                type="text" //HTMLの属性指定
                className="note-input"
                value={inputText} // 入力フィールドの値を状態にバインド
                onChange={handleInputChange} // 入力変更時のイベントハンドラ
                placeholder="ノートを入力してください..." // プレースホルダー
                autoFocus // コンポーネントがマウントされたときに自動的にフォーカス
            />
            <button className="add-note-button">追加</button>
        </div>


    )
}

