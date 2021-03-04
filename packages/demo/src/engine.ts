import { BFChainKVH as KVH } from "@kvh/typings";
import { Transaction } from "./transaction";
import { Height } from "./type";
import "fake-indexeddb/auto";
import { BaseStorage } from "./BaseStorage";

class TransactionStorage<
  E extends KVH.Engine.Engine.TransactionStorage.KeyVal = KVH.Engine.Engine.TransactionStorage.KeyVal
> implements KVH.Engine.Engine.TransactionStorage<E> {
  constructor(public readonly height: KVH.Engine.Engine.TransactionStorage.HeightInfo) {}
  private _baseStorage = new BaseStorage();
  reader = new ReadonlyStorage<E>(this.height, this._baseStorage);
  writer = new WritableStorage<E>(this.height, this._baseStorage);
}
class ReadonlyStorage<
  E extends KVH.Engine.Engine.TransactionStorage.KeyVal = KVH.Engine.Engine.TransactionStorage.KeyVal
> implements KVH.Engine.Engine.TransactionStorage.ReadonlyStorage<E> {
  constructor(
    public readonly height: KVH.Engine.Engine.TransactionStorage.HeightInfo,
    private _baseStorage: BaseStorage,
  ) {}
  has(key: KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  get<K extends KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>>(
    key: K,
  ): Promise<
    | {
        value: KVH.Engine.Engine.TransactionStorage.KeyVal.GetValueByKey<E, K>;
        height: KVH.Engine.Engine.TransactionStorage.HeightInfo;
      }
    | undefined
  > {
    throw new Error("Method not implemented.");
  }
}
class WritableStorage<
  E extends KVH.Engine.Engine.TransactionStorage.KeyVal = KVH.Engine.Engine.TransactionStorage.KeyVal
> implements KVH.Engine.Engine.TransactionStorage.WritableStorage<E> {
  constructor(
    public readonly height: KVH.Engine.Engine.TransactionStorage.HeightInfo,
    private _baseStorage: BaseStorage,
  ) {}
  set<K extends KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>>(
    key: K,
    data: {
      value: KVH.Engine.Engine.TransactionStorage.KeyVal.GetValueByKey<E, K>;
      height: KVH.Engine.Engine.TransactionStorage.HeightInfo;
    },
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(key: KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

// class BackupStorage<
//   E extends KVH.Engine.Engine.TransactionStorage.TypeMap = KVH.Engine.Engine.TransactionStorage.TypeMap
// > implements KVH.Engine.Engine.BackupStorage<E> {
//   openHeight(height: number): Promise<TransactionStorage<E>> {
//     throw new Error("Method not implemented.");
//   }
// }

export class Engine<
    E extends KVH.Engine.Engine.TransactionStorage.KeyVal = KVH.Engine.Engine.TransactionStorage.KeyVal
  >
  extends TransactionStorage<E>
  implements KVH.Engine.Engine<E> {
  openTransaction(height: number): Promise<KVH.Engine.Engine.TransactionStorage<E>> {
    throw new Error("Method not implemented.");
  }
  has(key: KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  get<K extends KVH.Engine.Engine.TransactionStorage.KeyVal.GetKey<E>>(key: K): Promise<{ value: KVH.Engine.Engine.TransactionStorage.KeyVal.GetValueByKey<E, K>; height: KVH.Engine.Engine.TransactionStorage.HeightInfo; } | undefined> {
    throw new Error("Method not implemented.");
  }
  // readonly backup = new BackupStorage<E>();
  // private _storage = new _EngineStorage();
  // private _maxHeight = 0;
  // private _minHeight = 0;
  // define(key: KVH.Base.Key.Type, ast: (key: KVH.Base.Key.Type) => KVH.Base.Value.Type) {}
  // get(key: KVH.Base.Key.Type, candidates?: KVH.Base.Key.Candidate.Type[]) {
  //   const jsKey = key.asJs();
  //   const cachedData = this._storage.get(jsKey);
  //   if (cachedData !== undefined) {
  //     if (candidates && cachedData.candidateMap) {
  //       for (const candidate of candidates) {
  //         const jsCandidate = candidate.asJs();
  //         const value = cachedData.candidateMap.get(jsCandidate);
  //         if (value !== undefined) {
  //           return value;
  //         }
  //       }
  //     }
  //     return cachedData.value;
  //   }
  // }
  // createTransaction(height: number) {
  //   return new Transaction(new Height(this._maxHeight, height), this);
  // }
  // saveTransactionStorage(
  //   height: number,
  //   storage: Map<
  //     KVH.Base.Key.Type,
  //     {
  //       value: KVH.Base.Value.Type;
  //       candidateMap?: Map<KVH.Base.Key.Candidate.Type, KVH.Base.Value.Type>;
  //       height: KVH.Base.Height.Type;
  //     }
  //   >,
  // ) {}
}
