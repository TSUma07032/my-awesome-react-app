/**
 * @fileoverview ユニークなIDを生成するためのユーティリティクラス
 * @auther 守屋翼
 */

// globalThis.crypto をモックする
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 15),
  },
});



/**
 * IDGeneratorは、ユニークなIDを生成するためのクラスです。
 * 
 * @example
 * ToDo
 */
export default class IDGenerator {
    /**
     * IDを生成します。
     * crypto.randomUUID()を使用して、ユニークなIDを生成します。
     * @param {} - 特に引数はありません。
     * @return {string} - 生成されたユニークなIDを返します。
     */
    generate(): string {
        return crypto.randomUUID();
    }

}
    