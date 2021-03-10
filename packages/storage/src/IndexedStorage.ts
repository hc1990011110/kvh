import { BFChainKVH as KVH, KVHValueJSON, KVHDiffStoreValue } from '@kvh/typings';
import 'fake-indexeddb/auto';
import { get, set, createStore, clear } from 'idb-keyval';
import { BaseStorage } from '@kvh/demo';

export class IndexedStorage extends BaseStorage implements KVH.Engine.BaseStorage {
  constructor() {
    super();
  }
  get(key: Uint8Array) {
    return get<Uint8Array>(key);
  }
  set(key: Uint8Array, value: Uint8Array) {
    return set(key, value);
  }
  clear() {
    return clear();
  }
}
