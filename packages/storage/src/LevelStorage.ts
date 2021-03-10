import { BFChainKVH as KVH } from '@kvh/typings';
import levelup from 'levelup';
import leveldown from 'leveldown';
import { BaseStorage } from '@kvh/demo';
import { Buffer } from 'buffer';

export class LevelStorage extends BaseStorage implements KVH.Engine.BaseStorage {
  constructor(public dbPath: string) {
    super();
  }
  protected kvhStore = this.createStore('kvh');
  createStore(dbName: string) {
    return levelup(leveldown(`${this.dbPath}/${dbName}`));
  }
  get(key: Uint8Array): Promise<Uint8Array | undefined> {
    return new Promise((resolve) => {
      this.kvhStore.get(Buffer.from(key), (error, value) => {
        if (error) {
          resolve(undefined);
          return;
        }
        resolve(new Uint8Array(Buffer.from(value)));
      });
    });
  }
  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      this.kvhStore.put(Buffer.from(key), Buffer.from(value), (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
  clear() {
    return this.kvhStore.clear();
  }
}
