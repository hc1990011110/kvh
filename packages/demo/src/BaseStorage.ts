import { BFChainKVH as KVH, TYPE_FLAG } from "@kvh/typings";
import { DIFF_MODE } from "@kvh/typings/src/const";
import { get, set } from "idb-keyval";

type DiffModel = { t: TYPE_FLAG; b: Uint8Array; m: DIFF_MODE; h: { c: number; p: number } };

export class BaseStorage implements KVH.Engine.Engine.TransactionStorage.BaseStorage {
  async readDiff(
    key: Uint8Array,
    height: number,
  ): Promise<
    | {
        typeFlag: TYPE_FLAG;
        diffBytes: Uint8Array;
        diffMode: DIFF_MODE;
        height: KVH.Engine.Engine.TransactionStorage.HeightInfo;
      }
    | undefined
  > {
    const value = await get(key);
    if (value) {
      return { diffBytes: value.b, diffMode: value.m, height: { curHeight: value.h.c, prevHeight: value.h.p } };
    }
  }
  async readHistory(key: Uint8Array, height: number) {}
  async writeDiff(
    key: Uint8Array,
    value: { diffBytes: Uint8Array; diffMode: DIFF_MODE; height: number },
  ): Promise<void> {
    const oldValue = await get(key);
    let prevHeight = 0;
    if (oldValue) {
      prevHeight = oldValue.h.c /* urHeight */;
      await set([key, prevHeight], oldValue);
    }
    return set(key, { b: value.diffBytes, m: value.diffMode, h: { c: value.height, p: prevHeight } });
  }
}
