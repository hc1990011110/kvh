/**
 * Type Alias
 */
export namespace T {
  export type Bool = boolean;
  export type Int8 = number;
  export type Uint8 = number;
  export type Int16 = number;
  export type Uint16 = number;
  export type Int32 = number;
  export type Uint32 = number;
  export type Int64 = number;
  export type Uint64 = number;
  export type Float32 = number;
  export type Float64 = number;
  export type Sha256 = Uint8Array & { byteLength: 32; length: 32 };
  export type Stream = Generator<Uint8Array, void, number | undefined>;
}
/**
 * KVH base type
 */
export namespace KVHBase {
  //#region 基础数据类型
  export namespace Type {
    /**
     * 基类
     */
    export interface Unit<T = unknown> {
      getBytes(): Uint8Array;
      asJs(): T;
    }
    export namespace Unit {
      export type Typeof<U> = U extends Unit<infer T> ? T : never;
    }
    /**
     * 字符串类型
     */
    export interface StringUtf8 extends Unit<string> {
      set(value: string): void;
    }
    /**
     * 二进制类型
     */
    export interface Bytes extends Unit<Uint8Array> {
      set(value: ArrayBufferView | ArrayBufferLike): void;
    }
    /**
     * 枚举类型
     */
    export interface Enum<K = unknown, U extends Unit = Unit> {
      getByName(name: K): U;
      getBytesByName(name: K): Uint8Array;
    }
    export namespace Enum {
      export interface Boolean extends Enum<T.Bool, Unit<T.Bool>> {}
      export interface Int8 extends Enum<T.Int8, Unit<T.Int8>> {}
      export interface Uint8 extends Enum<T.Uint8, Unit<T.Uint8>> {}
      export interface Int16 extends Enum<T.Int16, Unit<T.Int16>> {}
      export interface Uint16 extends Enum<T.Uint16, Unit<T.Uint16>> {}
      export interface Int32 extends Enum<T.Int32, Unit<T.Int32>> {}
      export interface Uint32 extends Enum<T.Uint32, Unit<T.Uint32>> {}
      export interface Int64 extends Enum<T.Int64, Unit<T.Int64>> {}
      export interface Uint64 extends Enum<T.Uint64, Unit<T.Uint64>> {}
      export interface Float32 extends Enum<T.Float32, Unit<T.Float32>> {}
      export interface Float64 extends Enum<T.Float64, Unit<T.Float64>> {}
    }
    /**
     * key-value集合
     */
    export interface Collection<I extends Collection.Item = Collection.Item> {
      getByKey(key: Collection.TypeofItemKey<I>): Collection.TypeofItemValue<I>;
    }
    export namespace Collection {
      export type Item<K extends Unit = Unit, V extends Unit = Unit> = {
        key: K;
        value: V;
      };
      export type TypeofItemKey<I> = I extends Item<infer K> ? K : never;
      export type TypeofItemValue<I> = I extends Item<infer _, infer V>
        ? V
        : never;
    }
    export interface Ast extends Unit {
      set(code: Ast.Builder): void;
    }
    export namespace Ast {
      export const enum ACTION {}
    }
    export namespace Ast {
      export interface Builder {}
    }
  }
  //#endregion

  export namespace Key {
    export type Types = Type.StringUtf8 | Type.Enum | Type.Bytes;
  }
  //#region 候选

  export namespace Candidate {
    export type Types = Type.Enum;
  }
  //#endregion
  export namespace Value {
    export type Types =
      | Type.StringUtf8
      | Type.Enum
      | Type.Bytes
      | Type.Collection
      | Type.Ast;
  }

  export namespace Height {
    export interface Type {
      prevHeight: 0;
      updatedHeight: 0;
    }
  }
}
