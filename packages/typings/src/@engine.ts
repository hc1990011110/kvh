import { KVHBase, T } from "./@base";
import { Evt } from "./@evt";
export declare namespace KVHEngine {
  export interface Engine {}
  export interface Engine2 {
    readonly backup: Engine.BackupStorage;
  }
  export namespace Engine {
    export interface BackupStorage {
      openHeight(height: number): Promise<TransactionStorage>;
    }
    /**事务存储 */
    export interface TransactionStorage<
      E extends TransactionStorage.TypeMap = TransactionStorage.TypeMap
    > {
      readonly height: TransactionStorage.HeightInfo;
      readonly reader: TransactionStorage.ReadonlyStorage<E>;
      readonly writer: TransactionStorage.WritableStorage<E>;
    }
    export namespace TransactionStorage {
      export type TypeMap<
        K extends KVHBase.Key.Type = KVHBase.Key.Type,
        V extends KVHBase.Value.Type = KVHBase.Value.Type
      > = { key: K; value: V };
      export namespace TypeMap {
        export type GetName<T> = T extends TypeMap<infer N> ? N : never;
        export type GetValue<T> = T extends TypeMap<infer _, infer U>
          ? U
          : never;
        export type GetValueByName<T, N> = T extends TypeMap<
          infer Name,
          infer U
        >
          ? N extends Name
            ? U
            : never
          : never;
      }

      export type DIFF_MODE = import("./const").DIFF_MODE;
      export type HeightInfo = { curHeight: number; prevHeight: number };
      export interface ReadonlyStorage<E extends TypeMap = TypeMap> {
        readonly height: HeightInfo;
        has(key: TypeMap.GetName<E>): Promise<boolean>;
        get<K extends TypeMap.GetName<E>>(
          key: K
        ): Promise<
          | undefined
          | { value: TypeMap.GetValueByName<E, K>; height: HeightInfo }
        >;
        // getValue
        // getPrevHeight
      }
      export interface WritableStorage<E extends TypeMap = TypeMap> {
        readonly height: HeightInfo;
        set<K extends TypeMap.GetName<E>>(
          key: K,
          data: { value: TypeMap.GetValueByName<E, K>; height: HeightInfo }
        ): Promise<void>;
        // setValue
        // setPrevHeight
        delete(key: TypeMap.GetName<E>): Promise<void>;
      }

      /**底层的读写接口
       * Browser依赖于IndexedDB
       * Nodejs依赖于LevelDB
       */
      export interface BaseStorage {
        read(
          key: Uint8Array
        ): Promise<
          | undefined
          | {
              diffBytes: Uint8Array;
              diffMode: TransactionStorage.DIFF_MODE;
              height: HeightInfo;
            }
        >;
        write(
          key: Uint8Array,
          value: {
            diffBytes: Uint8Array;
            diffMode: TransactionStorage.DIFF_MODE;
            height: HeightInfo;
          }
        ): Promise<void>;
      }
    }
  }
}
