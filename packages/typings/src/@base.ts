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
  export type Int64 = bigint;
  export type Uint64 = bigint;
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
    export interface Unit<T = unknown, F = T> extends Unit.ChangeAble<F> {
      getBytes(): Uint8Array;
      asJs(): T;
      diff(otherValue: Unit<T>): Uint8Array; //{action: delete,update,add, bytes: Uint8Array};
      recover(...oldBytes: Uint8Array[]): Unit<T>;
    }
    export namespace Unit {
      export type Typeof<U> = U extends Unit<infer T> ? T : never;
      export interface ChangeAble<T> {
        fromJs(value: T): void;
      }
    }
    /**
     * 字符串类型
     */
    export interface StringUtf8 extends Unit<string>, Unit.ChangeAble<string> {}
    /**
     * 二进制类型
     */
    export interface Bytes
      extends Unit<Uint8Array, ArrayBufferView | ArrayBufferLike> {}
    /**
     * 枚举类型
     */
    export type Enum =
      | Enum.Bool
      | Enum.Int8
      | Enum.Uint8
      | Enum.Int16
      | Enum.Uint16
      | Enum.Int32
      | Enum.Uint32
      | Enum.Int64
      | Enum.Uint64
      | Enum.Float32
      | Enum.Float64;
    export namespace Enum {
      export interface Bool extends Unit<T.Bool> {}
      export interface Int8 extends Unit<T.Int8> {}
      export interface Uint8 extends Unit<T.Uint8> {}
      export interface Int16 extends Unit<T.Int16> {}
      export interface Uint16 extends Unit<T.Uint16> {}
      export interface Int32 extends Unit<T.Int32> {}
      export interface Uint32 extends Unit<T.Uint32> {}
      export interface Int64 extends Unit<T.Int64> {}
      export interface Uint64 extends Unit<T.Uint64> {}
      export interface Float32 extends Unit<T.Float32> {}
      export interface Float64 extends Unit<T.Float64> {}

      export interface BaseEnum<K = unknown, U extends Unit = Unit> {
        getByName(name: K): U;
        getBytesByName(name: K): Uint8Array;
      }
      export interface BoolEnum extends BaseEnum<T.Bool, Bool> {}
      export interface Int8Enum extends BaseEnum<T.Int8, Int8> {}
      export interface Uint8Enum extends BaseEnum<T.Uint8, Uint8> {}
      export interface Int16Enum extends BaseEnum<T.Int16, Int16> {}
      export interface Uint16Enum extends BaseEnum<T.Uint16, Uint16> {}
      export interface Int32Enum extends BaseEnum<T.Int32, Int32> {}
      export interface Uint32Enum extends BaseEnum<T.Uint32, Uint32> {}
      export interface Int64Enum extends BaseEnum<T.Int64, Int64> {}
      export interface Uint64Enum extends BaseEnum<T.Uint64, Uint64> {}
      export interface Float32Enum extends BaseEnum<T.Float32, Float32> {}
      export interface Float64Enum extends BaseEnum<T.Float64, Float64> {}
    }
    /**
     * key-value集合
     */
    export interface Collection<I extends Collection.Item = Collection.Item> {
      getByKey(key: Collection.TypeofItemKey<I>): Collection.TypeofItemValue<I>;
    }
    export namespace Collection {
      export type Item<
        K extends Key.Type = Key.Type,
        V extends Value.Type = Value.Type
      > = {
        key: K;
        value: V;
      };
      export type TypeofItemKey<I> = I extends Item<infer K> ? K : never;
      export type TypeofItemValue<I> = I extends Item<infer _, infer V>
        ? V
        : never;
    }
    export interface Ast<R = unknown> extends Unit<() => R> {
      set(code: Ast.Builder<R>): void;
    }
    export namespace Ast {
      export const enum ACTION {}
    }
    export namespace Ast {
      export interface Builder<O = unknown> {
        output: O;
      }
    }
  }
  //#endregion

  export namespace Key {
    export type Type = Type.StringUtf8 | Type.Enum | Type.Bytes | Type.Ast;
    /**
     * 候选
     * 与key搭配使用，本质上我们可以使用 `fullKey=key+candidate` 来达成类似的效果
     * 但这里仍然独立设计了candidate，是有针对性的优化
     */
    export namespace Candidate {
      export type Type = Type.Enum;
    }
    export interface WithCandidateKey<
      K extends Type = Type,
      C extends Candidate.Type = Candidate.Type
    > extends Type.Unit<{
        key: Type.Unit.Typeof<K>;
        candidate: Type.Unit.Typeof<C>;
      }> {}

    export type MixType = Type | WithCandidateKey;
  }

  export namespace Value {
    export type Type =
      | Type.StringUtf8
      | Type.Enum
      | Type.Bytes
      | Type.Collection;
  }

  export namespace Height {
    export interface Type {
      prevHeight: number;
      updatedHeight: number;
    }
  }
}
