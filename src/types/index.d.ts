/**
 * @fileoverview 付箋アプリで使用する型定義
 */

/**
 * 付箋のデータ構造の型定義
 * @typedef {object} NoteData
 * @property {string} id - 付箋のユニークなID。
 * @property {string} text - 付箋の内容。
 */
export type NoteData = {
  id: string;
  text: string;
};