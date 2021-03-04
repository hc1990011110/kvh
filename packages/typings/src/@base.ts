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
    export type NamedType<N = unknown, U extends Unit = Unit> = {
      name: N;
      value: U;
    };
    export namespace NamedType {
      export type GetName<T> = T extends NamedType<infer N> ? N : never;
      export type GetValue<T> = T extends NamedType<infer _, infer U> ? U : never;
      export type GetValueByName<T, N> = T extends NamedType<infer Name, infer U>
        ? N extends Name
          ? U
          : never
        : never;
    }

    export type DIFF_MODE = import("./const").DIFF_MODE;
    /**
     * 基类
     */
    export interface Unit<T = unknown, F = T> extends Unit.ChangeAble<F>, Unit.DiffAble<T, F> {
      getBytes(): Uint8Array;
      asJs(): T;
    }
    export namespace Unit {
      export type GetType<U> = U extends Unit<infer T, infer _> ? T : never;
      export type GetFrom<U> = U extends Unit<infer _, infer T> ? T : never;
      export interface ChangeAble<T> {
        fromJs(value: T): void;
      }
      export type Diff = { bytes: Uint8Array; mode: DIFF_MODE };
      export interface DiffAble<T, F> {
        /**与旧值对比，得出差异 */
        diff(oldValue: Unit<T, F>): Diff;
        /**使用差异，计算出旧值 */
        recover(diff: Diff): Unit<T, F>;
      }
      export interface Factory<U extends Unit = Unit> {
        create(js: GetType<U>): U;
      }
      export type FactoryReturn<F> = F extends Factory<infer U> ? U : never;
    }
    /**
     * 字符串类型
     */
    export interface StringUtf8<T extends string = string, F = T> extends Unit<T, F> {}
    export namespace StringUtf8 {
      export interface Factory<U extends StringUtf8 = StringUtf8> extends Unit.Factory<U> {}
    }
    /**
     * 二进制类型
     */
    export interface Bytes<
      T extends ArrayBufferLike | ArrayBufferView = Uint8Array,
      F = ArrayBufferView | ArrayBufferLike
    > extends Unit<T, F> {}
    export namespace Bytes {
      export interface Factory<U extends Bytes = Bytes> extends Unit.Factory<U> {}
    }
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
      export interface Bool<V extends T.Bool = T.Bool, F = unknown> extends Unit<V, F> {}
      export interface Int8<V extends T.Int8 = T.Int8, F = unknown> extends Unit<V, F> {}
      export interface Uint8<V extends T.Uint8 = T.Uint8, F = unknown> extends Unit<V, F> {}
      export interface Int16<V extends T.Int16 = T.Int16, F = unknown> extends Unit<V, F> {}
      export interface Uint16<V extends T.Uint16 = T.Uint16, F = unknown> extends Unit<V, F> {}
      export interface Int32<V extends T.Int32 = T.Int32, F = unknown> extends Unit<V, F> {}
      export interface Uint32<V extends T.Uint32 = T.Uint32, F = unknown> extends Unit<V, F> {}
      export interface Int64<V extends T.Int64 = T.Int64, F = unknown> extends Unit<V, F> {}
      export interface Uint64<V extends T.Uint64 = T.Uint64, F = unknown> extends Unit<V, F> {}
      export interface Float32<V extends T.Float32 = T.Float32, F = unknown> extends Unit<V, F> {}
      export interface Float64<V extends T.Float64 = T.Float64, F = unknown> extends Unit<V, F> {}

      export interface Factory<E extends NamedType = NamedType> extends Unit.Factory<NamedType.GetValue<E>> {
        getByName<K extends NamedType.GetName<E>>(name: K): NamedType.GetValueByName<E, K>;
        getBytesByName(name: NamedType.GetName<E>): Uint8Array;
      }

      export type BoolTypeMap = NamedType<T.Bool, Bool<T.Bool>>;
      export type Int8TypeMap = NamedType<T.Int8, Int8>;
      export type Uint8TypeMap = NamedType<T.Uint8, Uint8>;
      export type Int16TypeMap = NamedType<T.Int16, Int16>;
      export type Uint16TypeMap = NamedType<T.Uint16, Uint16>;
      export type Int32TypeMap = NamedType<T.Int32, Int32>;
      export type Uint32TypeMap = NamedType<T.Uint32, Uint32>;
      export type Int64TypeMap = NamedType<T.Int64, Int64>;
      export type Uint64TypeMap = NamedType<T.Uint64, Uint64>;
      export type Float32TypeMap = NamedType<T.Float32, Float32>;
      export type Float64TypeMap = NamedType<T.Float64, Float64>;

      export interface BoolFactory<TM extends BoolTypeMap> extends Factory<TM> {}
      export interface Int8Factory<TM extends Int8TypeMap> extends Factory<TM> {}
      export interface Uint8Factory<TM extends Uint8TypeMap> extends Factory<TM> {}
      export interface Int16Factory<TM extends Int16TypeMap> extends Factory<TM> {}
      export interface Uint16Factory<TM extends Uint16TypeMap> extends Factory<TM> {}
      export interface Int32Factory<TM extends Int32TypeMap> extends Factory<TM> {}
      export interface Uint32Factory<TM extends Uint32TypeMap> extends Factory<TM> {}
      export interface Int64Factory<TM extends Int64TypeMap> extends Factory<TM> {}
      export interface Uint64Factory<TM extends Uint64TypeMap> extends Factory<TM> {}
      export interface Float32Factory<TM extends Float32TypeMap> extends Factory<TM> {}
      export interface Float64Factory<TM extends Float64TypeMap> extends Factory<TM> {}
    }
    /**
     * key-value集合
     */
    export interface Collection<I extends Collection.Item = Collection.Item>
      extends Unit<Map<Collection.TypeofItemKey<I>, Collection.TypeofItemValue<I>>> {
      getByKey(key: Collection.TypeofItemKey<I>): Collection.TypeofItemValue<I>;
    }
    export namespace Collection {
      export type Item<K extends Key.Type = Key.Type, V extends Value.Type = Value.Type> = {
        key: K;
        value: V;
      };
      export type TypeofItemKey<I> = I extends Item<infer K> ? K : never;
      export type TypeofItemValue<I> = I extends Item<infer _, infer V> ? V : never;
      export interface Factory<U extends Collection = Collection> extends Unit.Factory<U> {}
    }
    export interface Ast<R = unknown> extends Unit<() => R> {
      set(code: Ast.Builder<R>): void;
    }

    export namespace Ast {
      export type AST_ACTION = import("./const").AST_ACTION;
      export interface Builder<O = unknown> {
        output: O;
      }
      export interface Factory<U extends Ast = Ast> extends Unit.Factory<U> {}
    }
  }
  //#endregion

  export namespace Key {
    export type Type = Type.StringUtf8 | Type.Enum | Type.Bytes | Type.Ast;
    export type Factory = Type.Unit.Factory<Type>;
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
        key: Type.Unit.GetType<K>;
        candidate: Type.Unit.GetType<C>;
      }> {}

    export type MixType = Type | WithCandidateKey;
  }

  export namespace Value {
    export type Type = Type.StringUtf8 | Type.Enum | Type.Bytes | Type.Ast | Type.Collection;
    export type Factory = Type.Unit.Factory<Type>;
  }

  export namespace Height {
    export interface Type {
      prevHeight: number;
      updatedHeight: number;
    }
  }
}
