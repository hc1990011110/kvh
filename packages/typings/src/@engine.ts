import { BFChainKVH } from ".";
import { KVHBase, T } from "./@base";
import { Evt } from "./@evt";
export declare namespace KVHEngine {
  export type DIFF_MODE = import("./const").DIFF_MODE;
  export type TYPE_FLAG = import("./const").TYPE_FLAG;

  export interface Engine<E extends Engine.TransactionStorage.KeyVal = Engine.TransactionStorage.KeyVal>
    extends Engine.TransactionStorage.ReadonlyStorage<E> {
    // readonly backup: Engine.BackupStorage<E>;
    openTransaction(height: number): Promise<Engine.TransactionStorage<E>>;
  }
  export namespace Engine {
    // export interface BackupStorage<E extends Engine.TransactionStorage.TypeMap = Engine.TransactionStorage.TypeMap> {
    //   openHeight(height: number): Promise<TransactionStorage<E>>;
    // }
    /**事务存储 */
    export interface TransactionStorage<E extends TransactionStorage.KeyVal = TransactionStorage.KeyVal> {
      readonly height: TransactionStorage.HeightInfo;
      readonly reader: TransactionStorage.ReadonlyStorage<E>;
      readonly writer: TransactionStorage.WritableStorage<E>;
    }
    export namespace TransactionStorage {
      export type KeyVal<
        K extends KVHBase.Key.Type = KVHBase.Key.Type,
        V extends KVHBase.Value.Type = KVHBase.Value.Type
      > = { key: K; value: V };
      export namespace KeyVal {
        export type GetKey<KV> = KV extends KeyVal<infer N> ? N : never;
        export type GetValue<KV> = KV extends KeyVal<infer _, infer U> ? U : never;
        export type GetValueByKey<KV, K> = KV extends KeyVal<infer Name, infer U>
          ? K extends Name
            ? U
            : never
          : never;
      }

      export type HeightInfo = { curHeight: number; prevHeight: number };
      export interface ReadonlyStorage<E extends KeyVal = KeyVal> {
        readonly height: HeightInfo;
        has(key: KeyVal.GetKey<E>): Promise<boolean>;
        get<K extends KeyVal.GetKey<E>>(
          key: K,
        ): Promise<undefined | { value: KeyVal.GetValueByKey<E, K>; height: HeightInfo }>;
        // getValue
        // getPrevHeight
      }
      export interface WritableStorage<E extends KeyVal = KeyVal> {
        readonly height: HeightInfo;
        set<K extends KeyVal.GetKey<E>>(
          key: K,
          value: KeyVal.GetValueByKey<E, K>,
          // data: { value: KeyVal.GetValueByKey<E, K>; height: HeightInfo },
        ): Promise<void>;
        // setValue
        // setPrevHeight
        delete(key: KeyVal.GetKey<E>): Promise<void>;
      }
    }

    /**构建器 */
    export interface Builder<KV extends TransactionStorage.KeyVal, FT /* extends Builder.FlagedType */> {
      defineType<F extends number, T extends KVHBase.Value.Factory>(
        typeFlag: F,
        Factory: T,
      ): Builder<KV, FT | Builder.FlagedFactory<F, T>>;
      defineKey<K extends KVHBase.Key.Type, F extends Builder.FlagedType.GetFlag<FT>>(
        key: K,
        typeFlag: F,
      ): Builder<
        KV | TransactionStorage.KeyVal<K, KVHBase.Type.Unit.FactoryReturn<Builder.FlagedType.GetFactoryByFlag<FT, F>>>,
        FT
      >;
      toEngine(): Promise<Engine<KV>>;
    }
    export namespace Builder {
      export type FlagedFactory<F extends number = number, T extends KVHBase.Value.Factory = KVHBase.Value.Factory> = {
        flag: F;
        factory: T;
      };
      export namespace FlagedType {
        export type GetFlag<E> = E extends FlagedFactory<infer F, infer _> ? F : never;
        export type GetFactory<E> = E extends FlagedFactory<infer _, infer T> ? T : never;
        export type GetFactoryByFlag<FT, F> = FT extends FlagedFactory<infer Flag, infer T>
          ? F extends Flag
            ? T
            : never
          : never;
      }
    }
  }
  /**底层的读写接口
   * Browser依赖于IndexedDB
   * Nodejs依赖于LevelDB
   */
  export interface BaseStorage {
    read(key: KVHBase.Type.Unit, height?: number): Promise<KVHBase.Type.Unit | undefined>;
    write(
      key: KVHBase.Type.Unit,
      value: KVHBase.Type.Unit,
      height: number,
    ): Promise<Engine.TransactionStorage.HeightInfo>;

    readDiff(
      key: Uint8Array,
      height: number,
    ): Promise<
      | undefined
      | {
          typeFlag: TYPE_FLAG;
          diffList: KVHBase.Type.Unit.Diff[];
          height: Engine.TransactionStorage.HeightInfo;
        }[]
    >;
    writeDiff(key: Uint8Array, height: number, diff: KVHBase.Type.Unit.Diff): Promise<void>;
  }
}
