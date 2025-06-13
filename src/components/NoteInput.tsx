/**
 * NoteInput は、付箋を挿入するためのコンポーネントです。
 */

import { useState } from 'react';


/**
 * NoteInput関数
 * 
 * 
 * 入力されたテキストを表示するためのコンポーネントです。
 */
export default function NoteInput({text}: {text: string}) {
    const [inputText, setInputText] = useState(text);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };


    return (
        0
    );
}

