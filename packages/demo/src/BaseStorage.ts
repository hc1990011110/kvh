import { BFChainKVH as KVH, TYPE_FLAG } from "@kvh/typings";
import { DIFF_MODE } from "@kvh/typings/src/const";
import { get, set } from "idb-keyval";

type DiffModel = { t: TYPE_FLAG; b: Uint8Array; m: DIFF_MODE; h: { c: number; p: number } };

export class BaseStorage implements KVH.Engine.BaseStorage {
  read(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    height?: number,
  ): Promise<KVH.Base.Type.Unit<unknown, unknown> | undefined> {
    throw new Error("Method not implemented.");
  }
  write(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    value: KVH.Base.Type.Unit<unknown, unknown>,
    height: number,
  ): Promise<KVH.Engine.Engine.TransactionStorage.HeightInfo> {
    throw new Error("Method not implemented.");
  }
  readDiff(
    key: Uint8Array,
    height: number,
  ): Promise<
    | {
        typeFlag: TYPE_FLAG;
        diffList: KVH.Base.Type.Unit.Diff[];
        height: KVH.Engine.Engine.TransactionStorage.HeightInfo;
      }[]
    | undefined
  > {
    throw new Error("Method not implemented.");
  }
  writeDiff(key: Uint8Array, height: number, diff: KVH.Base.Type.Unit.Diff): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // async readDiff(
  //   key: Uint8Array,
  //   height: number,
  // ): Promise<
  //   | {
  //       typeFlag: TYPE_FLAG;
  //       diffBytes: Uint8Array;
  //       diffMode: DIFF_MODE;
  //       height: KVH.Engine.Engine.TransactionStorage.HeightInfo;
  //     }
  //   | undefined
  // > {
  //   const value = await get(key);
  //   if (value) {
  //     return { diffBytes: value.b, diffMode: value.m, height: { curHeight: value.h.c, prevHeight: value.h.p } };
  //   }
  // }
  // async readHistory(key: Uint8Array, height: number) {}
  // async writeDiff(
  //   key: Uint8Array,
  //   value: { diffBytes: Uint8Array; diffMode: DIFF_MODE; height: number },
  // ): Promise<void> {
  //   const oldValue = await get(key);
  //   let prevHeight = 0;
  //   if (oldValue) {
  //     prevHeight = oldValue.h.c /* urHeight */;
  //     await set([key, prevHeight], oldValue);
  //   }
  //   return set(key, { b: value.diffBytes, m: value.diffMode, h: { c: value.height, p: prevHeight } });
  // }
}
