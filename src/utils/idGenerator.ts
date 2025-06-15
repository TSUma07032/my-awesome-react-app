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
    