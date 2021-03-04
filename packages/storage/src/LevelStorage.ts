import { BFChainKVH as KVH, KVHValueJSON, KVHDiffStoreValue } from "@kvh/typings";
import levelup, { LevelUp } from "levelup";
import leveldown from "leveldown";
import { BaseStorage } from "@kvh/demo";
// import path from "path";
import { Buffer } from "buffer";
import { serialize, deserialize } from "v8";

export class LevelStorage extends BaseStorage implements KVH.Engine.BaseStorage {
  constructor(public dbPath: string) {
    super();
  }
  /**
   * @name kvh 数据库
   * @description 存储着key的最近value
   * key: u8a [keyU8a + typeFlag]
   * value: { value: u8a, maxHeight: number }
   */
  protected kvhStore = this.createStore("kvh");
  /**
   * @name diff 数据库
   * @description 存储着key每个高度对应上个高度的差异
   * key: u8a [keyU8a + heightU8a]
   * value: { ph: number, diff: KVH.Base.Type.Unit.Diff }
   */
  protected diffStore = this.createStore("diff");
  createStore(dbName: string) {
    return levelup(leveldown(`${this.dbPath}/${dbName}`));
  }
  getKvhStoreVal(key: Uint8Array): Promise<KVHValueJSON | undefined> {
    return new Promise((resolve, reject) => {
      this.kvhStore.get(Buffer.from(key), (err, value: Uint8Array) => {
        if (err) {
          resolve(undefined);
          return;
        }
        resolve(deserialize(value) as KVHValueJSON);
      });
    });
  }
  setKvhStoreVal(key: Uint8Array, value: KVHValueJSON) {
    return new Promise<void>((resolve, reject) => {
      this.kvhStore.put(Buffer.from(key), serialize(value), (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
  getDiffStoreVal(key: Uint8Array): Promise<KVHDiffStoreValue | undefined> {
    return new Promise((resolve) => {
      this.diffStore.get(Buffer.from(key), (err, value: Uint8Array) => {
        if (err) {
          resolve(undefined);
          return;
        }
        resolve(deserialize(value) as KVHDiffStoreValue);
      });
    });
  }
  setDiffStoreVal(key: Uint8Array, value: KVHDiffStoreValue) {
    return new Promise<void>((resolve, reject) => {
      this.diffStore.put(Buffer.from(key), serialize(value), (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
  clear() {
    return Promise.all([this.kvhStore.clear(), this.diffStore.clear()]);
  }
}
