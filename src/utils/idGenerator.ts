/**
 * @fileoverview ユニークなIDを生成するためのユーティリティクラス
 * @auther 守屋翼
 */

/**
 * IDGeneratorは、ユニークなIDを生成するためのクラスです。
 * 
 * @example
 * ToDo
 */
export default function generateUniqueId(): string { // ★★★ ここで関数を定義して、デフォルトエクスポートするニャ！ ★★★
  return crypto.randomUUID();
}