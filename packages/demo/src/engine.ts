import { BFChainKVH as KVH } from "@kvh/typings";
import { Transaction } from "./transaction";
import { Height } from "./type";

class _EngineStorage extends Map<
  unknown,
  //   KVHBase.Key.Type,
  {
    value: KVH.Base.Value.Type;
    candidateMap?: Map<
      unknown /* KVHBase.Key.Candidate.Type */,
      KVH.Base.Value.Type
    >;
    height: KVH.Base.Height.Type;
  }
> {}
export class Engine implements KVH.Engine.Engine {
  private _storage = new _EngineStorage();
  private _maxHeight = 0;
  private _minHeight = 0;
  define(
    key: KVH.Base.Key.Type,
    ast: (key: KVH.Base.Key.Type) => KVH.Base.Value.Type
  ) {}
  get(key: KVH.Base.Key.Type, candidates?: KVH.Base.Key.Candidate.Type[]) {
    const jsKey = key.asJs();
    const cachedData = this._storage.get(jsKey);
    if (cachedData !== undefined) {
      if (candidates && cachedData.candidateMap) {
        for (const candidate of candidates) {
          const jsCandidate = candidate.asJs();
          const value = cachedData.candidateMap.get(jsCandidate);
          if (value !== undefined) {
            return value;
          }
        }
      }
      return cachedData.value;
    }
  }
  createTransaction(height: number) {
    return new Transaction(new Height(this._maxHeight, height), this);
  }
  saveTransactionStorage(
    height: number,
    storage: Map<
      KVH.Base.Key.Type,
      {
        value: KVH.Base.Value.Type;
        candidateMap?: Map<KVH.Base.Key.Candidate.Type, KVH.Base.Value.Type>;
        height: KVH.Base.Height.Type;
      }
    >
  ) {}
}
