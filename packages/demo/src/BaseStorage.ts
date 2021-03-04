import { BFChainKVH as KVH, TYPE_FLAG, DIFF_MODE, KVHValueJSON, KVHDiffStoreValue } from "@kvh/typings";
import { recover, StringUtf8 } from "./type";

type DiffModel = { t: TYPE_FLAG; b: Uint8Array; m: DIFF_MODE; h: { c: number; p: number } };

/// TODO: 这边要在 define 那边拿到
const getFlagType = (key: KVH.Base.Type.Unit<unknown, unknown>) => {
  return TYPE_FLAG.StringUtf8;
};

export class BaseStorage implements KVH.Engine.BaseStorage {
  getDiffStoreKey(key: KVH.Base.Type.Unit<unknown, unknown>, height: number) {
    const keyU8a = key.getBytes();
    const storeKeyU8a = new Uint8Array(keyU8a.length + 4);
    storeKeyU8a.set(keyU8a);
    const dataView = new DataView(storeKeyU8a.buffer);
    dataView.setUint32(keyU8a.length, height);
    return storeKeyU8a;
  }
  getKvhStoreKey(key: KVH.Base.Type.Unit<unknown, unknown>) {
    const keyU8a = key.getBytes();
    const kvhKey = new Uint8Array(keyU8a.length + 1);
    kvhKey.set(keyU8a);
    kvhKey[kvhKey.byteLength - 1] = getFlagType(key);
    return kvhKey;
  }
  getKvhStoreVal(key: Uint8Array): Promise<KVHValueJSON | undefined> {
    throw new Error("Method not implemented.");
  }
  setKvhStoreVal(key: Uint8Array, value: KVHValueJSON): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getDiffStoreVal(key: Uint8Array): Promise<KVHDiffStoreValue | undefined> {
    throw new Error("Method not implemented.");
  }
  setDiffStoreVal(key: Uint8Array, value: KVHDiffStoreValue): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async read(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    height?: number,
  ): Promise<KVH.Base.Type.Unit<unknown, unknown> | undefined> {
    const kvhResult = await this.getKvhStoreVal(this.getKvhStoreKey(key));
    if (kvhResult === undefined) return;
    const { v: kvhVal, h: keyMaxHeight } = kvhResult;
    if (height === undefined) {
      height = keyMaxHeight;
    }
    // 当查询高度大于实际高度
    if (height > keyMaxHeight) {
      return;
    }
    const diffList = await this.readDiff(key, height);
    if (diffList === undefined) {
      return recover(getFlagType(key), kvhVal);
    }
    return recover(
      getFlagType(key),
      kvhVal,
      diffList.map((item) => item.diff),
    );
  }
  /**
   * @name 写入数据
   * @description
   * 1. 查看key的最高高度并与旧数据对比
   * 2. 把 差异结果 + 上个高度值 保存到 diffStore
   * 3. 把 value, maxHeight 保存到 kvhStore
   */
  async write(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    value: KVH.Base.Type.Unit<unknown, unknown>,
    height: number,
  ): Promise<KVH.Engine.Engine.TransactionStorage.HeightInfo> {
    const kvhKey = this.getKvhStoreKey(key);
    const kvhResult = await this.getKvhStoreVal(kvhKey);
    if (kvhResult === undefined) {
      await this.setKvhStoreVal(kvhKey, { h: height, v: value.getBytes() });
      return { prevHeight: 0, curHeight: height };
    }
    if (height <= kvhResult.h) {
      throw new ReferenceError("存储的值必须大于最大高度");
    }
    const oldVal = recover(getFlagType(key), kvhResult.v);
    const diff = value.diff(oldVal);
    await this.writeDiff(key, height, diff);
    await this.setKvhStoreVal(kvhKey, { h: height, v: value.getBytes() });
    return { prevHeight: kvhResult.h, curHeight: height };
  }
  async readDiff(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    height: number,
  ): Promise<
    | {
        diff: KVH.Base.Type.Unit.Diff;
        preHeight: number;
      }[]
    | undefined
  > {
    const kvhResult = await this.getKvhStoreVal(this.getKvhStoreKey(key));
    if (kvhResult === undefined) return [];
    const diffList = [];
    /// 回溯的当前高度
    let curHeight = kvhResult.h;
    while (curHeight > height) {
      const diffKey = this.getDiffStoreKey(key, curHeight);
      const diffResult = await this.getDiffStoreVal(diffKey);
      if (!diffResult) {
        return diffList;
      }
      diffList.push({ diff: diffResult.d, preHeight: diffResult.ph });
      curHeight = diffResult.ph;
    }
    return diffList;
  }
  async writeDiff(
    key: KVH.Base.Type.Unit<unknown, unknown>,
    height: number,
    diff: KVH.Base.Type.Unit.Diff,
  ): Promise<void> {
    const khKey = this.getDiffStoreKey(key, height);
    const kvhResult = await this.getKvhStoreVal(this.getKvhStoreKey(key));
    if (!kvhResult) return;
    await this.setDiffStoreVal(khKey, { ph: kvhResult.h, d: diff });
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
