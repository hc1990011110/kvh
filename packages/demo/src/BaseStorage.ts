import { BFChainKVH as KVH } from '@kvh/typings';

const num2u8a = (val: number) => {
  const valU8a = new Uint8Array([val >>> 24, val >>> 16, val >>> 8, val]);
  return valU8a;
};

const u8a2num = (buffer: Uint8Array) => {
  return buffer[0] * 16777216 + (buffer[1] << 16) + (buffer[2] << 8) + buffer[3];
};

export class BaseStorage implements KVH.Engine.BaseStorage {
  async read(key: KVH.Base.Type.Unit<unknown, unknown>, height?: number): Promise<Uint8Array | undefined> {
    if (height === undefined) {
      height = await this.getMaxHeight();
    }
    if (height === undefined) {
      return undefined;
    }
    const storeKeyU8a = this.createStoreKey(key, height);
    return this.get(storeKeyU8a);
  }
  /**
   * TODO: 后续加缓存
   */
  public async getMaxHeight() {
    const heightU8a = await this.get(this.maxHeightKey);
    if (heightU8a === undefined) {
      return undefined;
    }
    return u8a2num(heightU8a);
  }
  public setMaxHeight(height: number) {
    return this.set(this.maxHeightKey, num2u8a(height));
  }
  get maxHeightKey() {
    return new Uint8Array([0]);
  }
  /**
   * @name 写入数据
   * @description
   * key = [height: U32, value: U8a]
   */
  async write(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    value: KVH.Base.Type.Unit<unknown, unknown>,
    height: number,
  ): Promise<void> {
    const storeKeyU8a = this.createStoreKey(key, height);
    await this.set(storeKeyU8a, value.getBytes());
    const curMaxHeight = await this.getMaxHeight();
    if (curMaxHeight === undefined) {
      await this.setMaxHeight(height);
      return;
    }
    if (height > curMaxHeight) {
      await this.setMaxHeight(height);
    }
  }
  private createStoreKey(key: KVH.Base.Type.Unit<unknown, unknown>, height: number) {
    const keyU8a = key.getBytes();
    const storeKeyU8a = new Uint8Array(keyU8a.length + 4);
    storeKeyU8a.set(num2u8a(height), 0);
    storeKeyU8a.set(keyU8a, 4);
    return storeKeyU8a;
  }
  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Method not implemented.');
  }
  get(key: Uint8Array): Promise<Uint8Array | undefined> {
    throw new Error('Method not implemented.');
  }
}
