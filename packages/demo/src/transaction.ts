import { BFChainKVH as KVH } from "@kvh/typings";
import { Engine } from "./engine";

class _TransactionStorage extends Map<
  unknown,
  //   KVH.Base.Key.Type,
  {
    value: KVH.Base.Value.Type;
    candidateMap?: Map<unknown /* KVH.Base.Key.Candidate.Type */, KVH.Base.Value.Type>;
  }
> {}

export class Transaction implements KVH.DB.Database.Transaction {
  constructor(public readonly height: KVH.Base.Height.Type, private _engine: Engine) {}
  get(key: KVH.Base.Key.Type, candidates?: KVH.Base.Type.Enum[]): Promise<KVH.Base.Value.Type | undefined> {
    throw new Error("Method not implemented.");
  }
  dict: string = "";
  private _changeCache = new _TransactionStorage();
  set(key: KVH.Base.Key.Type, value: KVH.Base.Value.Type): void {
    let data = this._changeCache.get(key);
    if (data === undefined) {
      data = { value };
      this._changeCache.set(key, data);
    }
    return;
  }
  // async get(
  //   key: KVH.Base.Key.Type,
  //   candidates?: KVH.Base.Key.Candidate.Type[]
  // ): Promise<undefined | KVH.Base.Value.Type> {
  //   const jsKey = key.asJs();
  //   const cachedData = this._changeCache.get(jsKey);
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
  //   return this._engine.get(key, candidates);
  // }
  toCollection(): KVH.Base.Type.Collection<KVH.Base.Type.Collection.Item<KVH.Base.Key.Type, KVH.Base.Value.Type>> {
    throw new Error("Method not implemented.");
  }
  save(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private _hasUnSave = false;
  public get hasUnSave(): boolean {
    return this._hasUnSave;
  }
  public set hasUnSave(value: boolean) {
    this._hasUnSave = value;
  }
}
