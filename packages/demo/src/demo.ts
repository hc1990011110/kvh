import { BFChainKVH as KVH } from "@kvh/typings";
import { Engine } from "./engine";

class Database implements KVH.DB.Database {
  constructor(public readonly name: string) {}
  async startTransaction(height: number): Promise<KVH.DB.Database.Transaction> {
    throw new Error("Method not implemented.");
  }
  readonly dict: KVH.DB.Database.Dictionary = {} as any;
  hook(
    key: KVH.Base.Key.Type,
    transactionCallback: (
      trs: KVH.DB.Database.Transaction<KVH.Base.Type.Collection.Item<KVH.Base.Key.Type, KVH.Base.Value.Type>>,
    ) => void,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  get(key: KVH.Base.Key.Type, candidates?: KVH.Base.Key.Candidate.Type[]): Promise<KVH.DB.Database.Core.KVHInfo> {
    throw new Error("Method not implemented.");
  }
  subscribe(key: KVH.Base.Key.Type, candidates?: KVH.Base.Key.Candidate.Type[]): KVH.DB.Database.Core.Subscriber {
    throw new Error("Method not implemented.");
  }
  getAllSubscribe(): Map<string, KVH.DB.Database.Core.Subscriber> {
    throw new Error("Method not implemented.");
  }
  private readonly _maxHeight = 0;
  public get maxHeight(): number {
    return this._maxHeight;
  }
}
