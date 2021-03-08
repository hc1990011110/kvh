import { BFChainKVH as KVH, KVHValueJSON, KVHDiffStoreValue } from "@kvh/typings";
import "fake-indexeddb/auto";
import { get, set, createStore, clear } from "idb-keyval";
import { BaseStorage } from "@kvh/demo";

export class IndexedStorage extends BaseStorage implements KVH.Engine.BaseStorage {
  constructor(public dbName: string = "BFC_KVH") {
    super();
  }
  /**
   * @name kvh 数据库
   * @description 存储着key的最近value
   * key: u8a [keyU8a + typeFlag]
   * value: { value: u8a, maxHeight: number }
   */
  protected kvhStore = createStore(this.dbName, "kvh");
  /**
   * @name diff 数据库
   * @description 存储着key每个高度对应上个高度的差异
   * key: u8a [keyU8a + heightU8a]
   * value: { ph: number, diff: KVH.Base.Type.Unit.Diff }
   */
  protected diffStore = createStore(this.dbName + "_DIFF", "diff");
  getKvhStoreVal(key: Uint8Array): Promise<KVHValueJSON | undefined> {
    return get<KVHValueJSON>(key, this.kvhStore);
  }
  setKvhStoreVal(key: Uint8Array, value: KVHValueJSON) {
    return set(key, value, this.kvhStore);
  }
  getDiffStoreVal(key: Uint8Array) {
    return get<KVHDiffStoreValue>(key, this.diffStore);
  }
  setDiffStoreVal(key: Uint8Array, value: KVHDiffStoreValue) {
    return set(key, value, this.diffStore);
  }
  clear() {
    return Promise.all([clear(this.kvhStore), clear(this.diffStore)]);
  }
}
