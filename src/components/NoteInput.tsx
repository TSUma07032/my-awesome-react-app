/**
 * @filename NoteInput.tsx
 * @fileoverview NoteInputコンポーネントは、入力されたテキストを表示するためのReactコンポーネントです。
 * @author 守屋翼
 */

import React, {useState} from 'react';

/**
 * NoteInputPropsは、NoteInputコンポーネントに渡されるプロパティの型定義です。
 * * @property {function} onAddNote - ノート追加時のコールバック関数。
 * @example
 * const noteInputProps: NoteInputProps = {
 *   onAddNote: (text) => {
 *     console.log(`新しいノートが追加されました: ${text}`);
 *  }
 */
type NoteInputProps = {
    onAddNote: (text: string) => void; // ノート追加時のコールバック関数
};


/**
 * NoteInput関数コンポーネントは、入力されたテキストを表示するためのReactコンポーネントです。
 * @param {NoteInputProps} props - NoteInputコンポーネントに渡されるプロパティ。
 * @return {JSX.Element} - 入力フィールドと追加ボタンを含むReact要素。
 *  
 * @example
 * ToDo
 * 
 */
export default function NoteInput({ onAddNote }: NoteInputProps){

    // useStateフックを使用して、入力されたテキストを管理
    const [inputText, setInputText] = useState('');

    // 入力テキストの変更を処理する関数
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value); // 入力されたテキストを更新

    };

    // 追加ボタンがクリックされたときの処理
    const handleAddButtonClick = () => {
        if (inputText.trim() !== '') { // 入力が空でない場合
            onAddNote (inputText); // コールバック関数を呼び出してノートを追加
            setInputText(''); // 入力フィールドをクリア
        }
    }


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
            <button className="add-note-button" onClick={handleAddButtonClick}>追加</button>
        </div>


    )
}

