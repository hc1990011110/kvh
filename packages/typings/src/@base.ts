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
    export interface Bytes extends Unit<Uint8Array, ArrayBufferView | ArrayBufferLike> {}
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
      export interface EnumWithAlias<A = unknown> {}
      export interface Bool<V extends T.Bool = T.Bool, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Int8<V extends T.Int8 = T.Int8, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Uint8<V extends T.Uint8 = T.Uint8, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Int16<V extends T.Int16 = T.Int16, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Uint16<V extends T.Uint16 = T.Uint16, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Int32<V extends T.Int32 = T.Int32, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Uint32<V extends T.Uint32 = T.Uint32, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Int64<V extends T.Int64 = T.Int64, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Uint64<V extends T.Uint64 = T.Uint64, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Float32<V extends T.Float32 = T.Float32, A = unknown> extends Unit<V>, EnumWithAlias<A> {}
      export interface Float64<V extends T.Float64 = T.Float64, A = unknown> extends Unit<V>, EnumWithAlias<A> {}

      export type TypeMap<N = unknown, U extends Unit = Unit> = {
        name: N;
        value: U;
      };
      export namespace TypeMap {
        export type GetName<T> = T extends TypeMap<infer N> ? N : never;
        export type GetValue<T> = T extends TypeMap<infer _, infer U> ? U : never;
        export type GetValueByName<T, N> = T extends TypeMap<infer Name, infer U>
          ? N extends Name
            ? U
            : never
          : never;
      }

      export interface BaseEnum<E extends TypeMap = TypeMap> {
        getByName<K extends TypeMap.GetName<E>>(name: K): TypeMap.GetValueByName<E, K>;
        getBytesByName(name: TypeMap.GetName<E>): Uint8Array;
      }

      export type BoolTypeMap = TypeMap<true, Bool<true>> | TypeMap<false, Bool<false>>;
      export type Int8TypeMap = TypeMap<T.Int8, Int8>;
      export type Uint8TypeMap = TypeMap<T.Uint8, Uint8>;
      export type Int16TypeMap = TypeMap<T.Int16, Int16>;
      export type Uint16TypeMap = TypeMap<T.Uint16, Uint16>;
      export type Int32TypeMap = TypeMap<T.Int32, Int32>;
      export type Uint32TypeMap = TypeMap<T.Uint32, Uint32>;
      export type Int64TypeMap = TypeMap<T.Int64, Int64>;
      export type Uint64TypeMap = TypeMap<T.Uint64, Uint64>;
      export type Float32TypeMap = TypeMap<T.Float32, Float32>;
      export type Float64TypeMap = TypeMap<T.Float64, Float64>;

      export interface BoolEnum extends BaseEnum<BoolTypeMap> {}
      export interface Int8Enum extends BaseEnum<Int8TypeMap> {}
      export interface Uint8Enum extends BaseEnum<Uint8TypeMap> {}
      export interface Int16Enum extends BaseEnum<Int16TypeMap> {}
      export interface Uint16Enum extends BaseEnum<Uint16TypeMap> {}
      export interface Int32Enum extends BaseEnum<Int32TypeMap> {}
      export interface Uint32Enum extends BaseEnum<Uint32TypeMap> {}
      export interface Int64Enum extends BaseEnum<Int64TypeMap> {}
      export interface Uint64Enum extends BaseEnum<Uint64TypeMap> {}
      export interface Float32Enum extends BaseEnum<Float32TypeMap> {}
      export interface Float64Enum extends BaseEnum<Float64TypeMap> {}
    }
    /**
     * key-value集合
     */
    export interface Collection<I extends Collection.Item = Collection.Item> {
      getByKey(key: Collection.TypeofItemKey<I>): Collection.TypeofItemValue<I>;
    }
    export namespace Collection {
      export type Item<K extends Key.Type = Key.Type, V extends Value.Type = Value.Type> = {
        key: K;
        value: V;
      };
      export type TypeofItemKey<I> = I extends Item<infer K> ? K : never;
      export type TypeofItemValue<I> = I extends Item<infer _, infer V> ? V : never;
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
    export type Type = Type.StringUtf8 | Type.Enum | Type.Bytes | Type.Collection;
  }

  export namespace Height {
    export interface Type {
      prevHeight: number;
      updatedHeight: number;
    }
  }
}
