import { KVHBase } from "./@base";

export type KVHValueJSON = { h: number; v: Uint8Array };

export type KVHDiffStoreValue = { ph: number; d: KVHBase.Type.Unit.Diff };
