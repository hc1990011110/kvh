import { BFChainKVH as KVH } from "@kvh/typings";

export class Height implements KVH.Base.Height.Type {
  constructor(public prevHeight = 0, public updatedHeight = 0) {}
}
abstract class Unit<T = unknown, F = T> implements KVH.Base.Type.Unit<T, F> {
  abstract fromJs(value: F): void;
  abstract asJs(): T;
  abstract getBytes(): Uint8Array;
  //   abstract diff(otherValue: KVHBase.Type.Unit<T>): Uint8Array;
  //   abstract recover(...oldBytes: Uint8Array[]): KVHBase.Type.Unit<T>;

  diff(otherValue: KVH.Base.Type.Unit<T>): Uint8Array {
    throw new Error("Method not implemented.");
  }
  recover(...oldBytes: Uint8Array[]): KVH.Base.Type.Unit<T> {
    throw new Error("Method not implemented.");
  }
}

abstract class CommonUnit<T = unknown> extends Unit<T> {
  protected abstract _js: T;
  fromJs(value: T) {
    this._js = value;
  }
  asJs() {
    return this._js;
  }
}

export class StringUtf8
  extends CommonUnit<string>
  implements KVH.Base.Type.StringUtf8 {
  static readonly encoder = new TextEncoder();
  protected _js: string = "";
  getBytes(): Uint8Array {
    return StringUtf8.encoder.encode(this._js);
  }
}
export class Bool
  extends CommonUnit<KVH.T.Bool>
  implements KVH.Base.Type.Enum.Bool {
  static readonly True = new Uint8Array(0);
  static readonly False = new Uint8Array(1);
  constructor(protected _js: boolean = false) {
    super();
  }
  getBytes(): Uint8Array {
    return this._js ? Bool.True : Bool.False;
  }
}
export class Int8
  extends CommonUnit<KVH.T.Int8>
  implements KVH.Base.Type.Enum.Int8 {
  static readonly typedArray = new Int8Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int8;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint8
  extends CommonUnit<KVH.T.Uint8>
  implements KVH.Base.Type.Enum.Uint8 {
  static readonly typedArray = new Uint8Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint8;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int16
  extends CommonUnit<KVH.T.Int16>
  implements KVH.Base.Type.Enum.Int16 {
  static readonly typedArray = new Int16Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int16;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint16
  extends CommonUnit<KVH.T.Uint16>
  implements KVH.Base.Type.Enum.Uint16 {
  static readonly typedArray = new Uint16Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint16;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int32
  extends CommonUnit<KVH.T.Int32>
  implements KVH.Base.Type.Enum.Int32 {
  static readonly typedArray = new Int32Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Int32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Uint32
  extends CommonUnit<KVH.T.Uint32>
  implements KVH.Base.Type.Enum.Uint32 {
  static readonly typedArray = new Uint32Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Uint32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Int64
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
export class Uint64
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
export class Float32
  extends CommonUnit<KVH.T.Float32>
  implements KVH.Base.Type.Enum.Float32 {
  static readonly typedArray = new Float32Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Float32;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}
export class Float64
  extends CommonUnit<KVH.T.Float64>
  implements KVH.Base.Type.Enum.Float64 {
  static readonly typedArray = new Float64Array(1);
  constructor(protected _js: number = 0) {
    super();
  }
  getBytes(): Uint8Array {
    const { typedArray } = Float64;
    typedArray[0] = this._js;
    return new Uint8Array(typedArray.buffer);
  }
}

export abstract class BaseEnum<K = unknown, U extends Unit = Unit>
  implements KVH.Base.Type.Enum.BaseEnum {
  abstract getByName(name: unknown): KVH.Base.Type.Unit<unknown, unknown>;
  getBytesByName(name: unknown): Uint8Array {
    return this.getByName(name).getBytes();
  }
}
export class BoolEnum
  extends BaseEnum<KVH.T.Bool>
  implements KVH.Base.Type.Enum.BoolEnum {
  getByName(name: boolean): KVH.Base.Type.Enum.Bool {
    return new Bool(name);
  }
}
export class Int8Enum
  extends BaseEnum<KVH.T.Int8>
  implements KVH.Base.Type.Enum.Int8Enum {
  getByName(name: KVH.T.Int8) {
    return new Int8(name);
  }
}
export class Uint8Enum
  extends BaseEnum<KVH.T.Uint8>
  implements KVH.Base.Type.Enum.Uint8Enum {
  getByName(name: KVH.T.Uint8) {
    return new Uint8(name);
  }
}
export class Int16Enum
  extends BaseEnum<KVH.T.Int16>
  implements KVH.Base.Type.Enum.Int16Enum {
  getByName(name: KVH.T.Int16) {
    return new Int16(name);
  }
}
export class Uint16Enum
  extends BaseEnum<KVH.T.Uint16>
  implements KVH.Base.Type.Enum.Uint16Enum {
  getByName(name: KVH.T.Uint16) {
    return new Uint16(name);
  }
}
export class Int32Enum
  extends BaseEnum<KVH.T.Int32>
  implements KVH.Base.Type.Enum.Int32Enum {
  getByName(name: KVH.T.Int32) {
    return new Int32(name);
  }
}
export class Uint32Enum
  extends BaseEnum<KVH.T.Uint32>
  implements KVH.Base.Type.Enum.Uint32Enum {
  getByName(name: KVH.T.Uint32) {
    return new Uint32(name);
  }
}
export class Int64Enum
  extends BaseEnum<KVH.T.Int64>
  implements KVH.Base.Type.Enum.Int64Enum {
  getByName(name: KVH.T.Int64) {
    return new Int64(name);
  }
}
export class Uint64Enum
  extends BaseEnum<KVH.T.Uint64>
  implements KVH.Base.Type.Enum.Uint64Enum {
  getByName(name: KVH.T.Uint64) {
    return new Uint64(name);
  }
}
export class Float32Enum
  extends BaseEnum<KVH.T.Float32>
  implements KVH.Base.Type.Enum.Float32Enum {
  getByName(name: KVH.T.Float32) {
    return new Float32(name);
  }
}
export class Float64Enum
  extends BaseEnum<KVH.T.Float64>
  implements KVH.Base.Type.Enum.Float64Enum {
  getByName(name: KVH.T.Float64) {
    return new Float64(name);
  }
}
