import { BFChainKVH as KVH, DIFF_MODE, TYPE_FLAG } from "@kvh/typings";

export class Height implements KVH.Base.Height.Type {
  constructor(public prevHeight = 0, public updatedHeight = 0) {}
}
abstract class Unit<T = unknown, F = T> implements KVH.Base.Type.Unit<T, F> {
  abstract fromJs(value: F): void;
  abstract asJs(): T;
  abstract getBytes(): Uint8Array;
  abstract diff(oldValue: Unit<T, F>): KVH.Base.Type.Unit.Diff;
  abstract recover(diff: KVH.Base.Type.Unit.Diff): Unit<T, F>;
}

abstract class CommonUnit<T = unknown, F = T> extends Unit<T, F> {
  protected abstract _js: T;
  fromJs(value: F) {
    this._js = (value as unknown) as T;
  }
  asJs() {
    return this._js;
  }
}

export class StringUtf8<T extends string = string, F = T>
  extends CommonUnit<T, F>
  implements KVH.Base.Type.StringUtf8<T, F> {
  diff(oldValue: Unit<T, F>): KVH.Base.Type.Unit.Diff {
    return { mode: DIFF_MODE.BACKUP, bytes: oldValue.getBytes() };
  }
  recover(diff: KVH.Base.Type.Unit.Diff): Unit<T, F> {
    const { mode } = diff;
    switch (mode) {
      case DIFF_MODE.BACKUP:
        return new StringUtf8<T, F>(StringUtf8.decoder.decode(diff.bytes) as T);
    }
    throw new TypeError(`diff mode ${mode} not implemented.`);
  }

  static readonly encoder = new TextEncoder();
  static readonly decoder = new TextDecoder();
  constructor(protected _js: T = "" as T) {
    super();
  }
  getBytes(): Uint8Array {
    return StringUtf8.encoder.encode(this._js);
  }
}
export class StringUtf8FactoryCtor<U extends StringUtf8 = StringUtf8> implements KVH.Base.Type.StringUtf8.Factory<U> {
  create(js: KVH.Base.Type.Unit.GetType<U>): U {
    return (new StringUtf8(js) as unknown) as U;
  }
}
export const StringUtf8Factory = new StringUtf8FactoryCtor();

export class Bool<V extends KVH.T.Bool = KVH.T.Bool, F = V>
  extends CommonUnit<V, F>
  implements KVH.Base.Type.Enum.Bool<V, F> {
  diff(oldValue: Unit<V, F>): KVH.Base.Type.Unit.Diff {
    return { mode: DIFF_MODE.BACKUP, bytes: oldValue.getBytes() };
  }
  recover(diff: KVH.Base.Type.Unit.Diff): Unit<V, F> {
    const { mode } = diff;
    switch (mode) {
      case DIFF_MODE.BACKUP:
        return new Bool<V, F>((diff.bytes[0] === 1) as V);
    }
    throw new TypeError(`diff mode ${mode} not implemented.`);
  }
  static readonly True = new Uint8Array(0);
  static readonly False = new Uint8Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    return this._js ? Bool.True : Bool.False;
  }
}
export class Int8<V extends KVH.T.Int8 = KVH.T.Int8, F = V>
  extends CommonUnit<V, F>
  implements KVH.Base.Type.Enum.Int8<V, F> {
  diff(oldValue: Unit<V, F>): KVH.Base.Type.Unit.Diff {
    return { mode: DIFF_MODE.BACKUP, bytes: oldValue.getBytes() };
  }
  recover(diff: KVH.Base.Type.Unit.Diff): Unit<V, F> {
    const { mode } = diff;
    const { typedArray } = Int8;
    switch (mode) {
      case DIFF_MODE.BACKUP:
        typedArray.set(diff.bytes);
        return new Int8<V, F>(typedArray[0] as V);
    }
    throw new TypeError(`diff mode ${mode} not implemented.`);
  }
  static readonly typedArray = new Int8Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int8;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
/* export class Uint8<V extends KVH.T.Uint8 = KVH.T.Uint8>
  extends CommonUnit<KVH.T.Uint8>
  implements KVH.Base.Type.Enum.Uint8 {
  static readonly typedArray = new Uint8Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint8;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int16<V extends KVH.T.Int16 = KVH.T.Int16>
  extends CommonUnit<KVH.T.Int16>
  implements KVH.Base.Type.Enum.Int16 {
  static readonly typedArray = new Int16Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int16;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint16<V extends KVH.T.Uint16 = KVH.T.Uint16>
  extends CommonUnit<KVH.T.Uint16>
  implements KVH.Base.Type.Enum.Uint16 {
  static readonly typedArray = new Uint16Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint16;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int32<V extends KVH.T.Int32 = KVH.T.Int32>
  extends CommonUnit<KVH.T.Int32>
  implements KVH.Base.Type.Enum.Int32 {
  static readonly typedArray = new Int32Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint32<V extends KVH.T.Uint32 = KVH.T.Uint32>
  extends CommonUnit<KVH.T.Uint32>
  implements KVH.Base.Type.Enum.Uint32 {
  static readonly typedArray = new Uint32Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int64<V extends KVH.T.Int64 = KVH.T.Int64>
  extends CommonUnit<KVH.T.Int64>
  implements KVH.Base.Type.Enum.Int64 {
  static readonly typedArray = new BigInt64Array(1);
  constructor(protected _js: bigint = 0n) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int64;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint64<V extends KVH.T.Uint64 = KVH.T.Uint64>
  extends CommonUnit<KVH.T.Uint64>
  implements KVH.Base.Type.Enum.Uint64 {
  static readonly typedArray = new BigUint64Array(1);
  constructor(protected _js: bigint = 0n) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint64;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Float32<V extends KVH.T.Float32 = KVH.T.Float32>
  extends CommonUnit<KVH.T.Float32>
  implements KVH.Base.Type.Enum.Float32 {
  static readonly typedArray = new Float32Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Float32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Float64<V extends KVH.T.Float64 = KVH.T.Float64>
  extends CommonUnit<KVH.T.Float64>
  implements KVH.Base.Type.Enum.Float64 {
  static readonly typedArray = new Float64Array(1);
  constructor(protected _js: V) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Float64;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
} */

export abstract class EnumFactory<E extends KVH.Base.Type.NamedType = KVH.Base.Type.NamedType>
  implements KVH.Base.Type.Enum.Factory<E> {
  abstract create(
    js: KVH.Base.Type.Unit.GetType<KVH.Base.Type.NamedType.GetValue<E>>,
  ): KVH.Base.Type.NamedType.GetValue<E>;
  abstract getByName<K extends KVH.Base.Type.NamedType.GetName<E>>(
    name: K,
  ): KVH.Base.Type.NamedType.GetValueByName<E, K>;
  getBytesByName(name: KVH.Base.Type.NamedType.GetName<E>): Uint8Array {
    return this.getByName(name).getBytes();
  }
}
class BoolFactoryCtor<TM extends KVH.Base.Type.Enum.BoolTypeMap>
  extends EnumFactory<TM>
  implements KVH.Base.Type.Enum.BoolFactory<TM> {
  create(js: KVH.Base.Type.Unit.GetType<KVH.Base.Type.NamedType.GetValue<TM>>): KVH.Base.Type.NamedType.GetValue<TM> {
    return this.getByName(js as never);
  }
  getByName<K extends KVH.Base.Type.NamedType.GetName<TM>>(name: K) {
    return (new Bool(name) as unknown) as KVH.Base.Type.NamedType.GetValueByName<TM, K>;
  }
}
export const BoolFactory = new BoolFactoryCtor();

class Int8FactoryCtor<TM extends KVH.Base.Type.Enum.Int8TypeMap>
  extends EnumFactory<TM>
  implements KVH.Base.Type.Enum.Int8Factory<TM> {
  create(js: KVH.Base.Type.Unit.GetType<KVH.Base.Type.NamedType.GetValue<TM>>): KVH.Base.Type.NamedType.GetValue<TM> {
    return this.getByName(js as never);
  }
  getByName<K extends KVH.Base.Type.NamedType.GetName<TM>>(name: K) {
    return (new Int8(name) as unknown) as KVH.Base.Type.NamedType.GetValueByName<TM, K>;
  }
}
export const Int8Factory = new Int8FactoryCtor();
/* export class Uint8Enum extends BaseEnum<KVH.Base.Type.Enum.Uint8TypeMap> implements KVH.Base.Type.Enum.Uint8Factory {
  getByName<K extends KVH.T.Uint8>(name: K) {
    return (new Uint8(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Uint8TypeMap,
      K
    >;
  }
}
export class Int16Enum extends BaseEnum<KVH.Base.Type.Enum.Int16TypeMap> implements KVH.Base.Type.Enum.Int16Factory {
  getByName<K extends KVH.T.Int16>(name: K) {
    return (new Int16(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Int16TypeMap,
      K
    >;
  }
}
export class Uint16Enum extends BaseEnum<KVH.Base.Type.Enum.Uint16TypeMap> implements KVH.Base.Type.Enum.Uint16Factory {
  getByName<K extends KVH.T.Uint16>(name: K) {
    return (new Uint16(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Uint16TypeMap,
      K
    >;
  }
}
export class Int32Enum extends BaseEnum<KVH.Base.Type.Enum.Int32TypeMap> implements KVH.Base.Type.Enum.Int32Factory {
  getByName<K extends KVH.T.Int32>(name: K) {
    return (new Int32(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Int32TypeMap,
      K
    >;
  }
}
export class Uint32Enum extends BaseEnum<KVH.Base.Type.Enum.Uint32TypeMap> implements KVH.Base.Type.Enum.Uint32Factory {
  getByName<K extends KVH.T.Uint32>(name: K) {
    return (new Uint32(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Uint32TypeMap,
      K
    >;
  }
}
export class Int64Enum extends BaseEnum<KVH.Base.Type.Enum.Int64TypeMap> implements KVH.Base.Type.Enum.Int64Factory {
  getByName<K extends KVH.T.Int64>(name: K) {
    return (new Int64(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Int64TypeMap,
      K
    >;
  }
}
export class Uint64Enum extends BaseEnum<KVH.Base.Type.Enum.Uint64TypeMap> implements KVH.Base.Type.Enum.Uint64Factory {
  getByName<K extends KVH.T.Uint64>(name: K) {
    return (new Uint64(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Uint64TypeMap,
      K
    >;
  }
}
export class Float32Enum extends BaseEnum<KVH.Base.Type.Enum.Float32TypeMap> implements KVH.Base.Type.Enum.Float32Factory {
  getByName<K extends KVH.T.Float32>(name: K) {
    return (new Float32(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Float32TypeMap,
      K
    >;
  }
}
export class Float64Enum extends BaseEnum<KVH.Base.Type.Enum.Float64TypeMap> implements KVH.Base.Type.Enum.Float64Factory {
  getByName<K extends KVH.T.Float64>(name: K) {
    return (new Float64(name) as unknown) as KVH.Base.Type.TypeMap.GetValueByName<
      KVH.Base.Type.Enum.Float64TypeMap,
      K
    >;
  }
} */

export function recover(typeFlag: TYPE_FLAG, source: unknown, diffList: KVH.Base.Type.Unit.Diff[]) {
  switch (typeFlag) {
    case TYPE_FLAG.StringUtf8:
      let res = new StringUtf8(source as string);
      for (const diff of diffList) {
        res = res.recover(diff);
      }
      break;
    case TYPE_FLAG.Bool:
      break;
    case TYPE_FLAG.Int8:
      break;
    case TYPE_FLAG.Uint8:
      break;
    case TYPE_FLAG.Int16:
      break;
    case TYPE_FLAG.Uint16:
      break;
    case TYPE_FLAG.Int32:
      break;
    case TYPE_FLAG.Uint32:
      break;
    case TYPE_FLAG.Int64:
      break;
    case TYPE_FLAG.Uint64:
      break;
    case TYPE_FLAG.Float32:
      break;
    case TYPE_FLAG.Float64:
      break;
  }
  throw new Error("");
  // typeNever(typeFlag);
}
