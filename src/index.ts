import { KVHBase } from "./@base";
import { KVHDb } from "./@db";
export declare namespace BFChainKVH {
  //   export type KVH = KVH.Db;
  export { KVHDb as DB };
  export { KVHBase as Base };
}

type A = BFChainKVH.Base.Key.Types;
