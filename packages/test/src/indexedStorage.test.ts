import { IndexedStorage } from "@kvh/storage";
import { StringUtf8 } from "@kvh/demo";
import test from "ava";
import fs from "fs";
import path from "path";
const testDir = path.join(__dirname, "../data");
try {
  rmdir(testDir);
} catch {}

test("测试是否能正常读写数据", async (t) => {
  const storage = createStore();
  const height = 0;
  const saveVal = new StringUtf8(`value::${height}`);
  const writeRes = await storage.write(new StringUtf8("name"), saveVal, height);
  const getVal = await storage.read(new StringUtf8("name"), height);
  t.is(saveVal.asJs(), getVal ? getVal.asJs() : undefined);
  t.is(writeRes.curHeight, 0);
  t.is(writeRes.prevHeight, 0);
});

test("测试是否保存返回值是否是正确的", async (t) => {
  const storage = createStore();
  const save = async (height: number) => {
    const saveVal = new StringUtf8(`value::${height}`);
    return await storage.write(new StringUtf8("name"), saveVal, height);
  };
  const saveRes1 = await save(0);
  t.is(saveRes1.curHeight, 0);
  t.is(saveRes1.prevHeight, 0);
  const saveRes3 = await save(3);
  t.is(saveRes3.curHeight, 3);
  t.is(saveRes3.prevHeight, 0);
  const saveRes5 = await save(5);
  t.is(saveRes5.curHeight, 5);
  t.is(saveRes5.prevHeight, 3);
});

test("测试是否正确回滚数据", async (t) => {
  const storage = createStore();
  const save = async (height: number) => {
    const saveVal = new StringUtf8(`value::${height}`);
    return await storage.write(new StringUtf8("name"), saveVal, height);
  };
  await save(0);
  await save(3);
  await save(5);
  const getVal0 = await storage.read(new StringUtf8("name"), 0);
  t.is(getVal0 ? getVal0.asJs() : undefined, `value::${0}`);
  const getVal1 = await storage.read(new StringUtf8("name"), 1);
  t.is(getVal1 ? getVal1.asJs() : undefined, `value::${0}`);
  const getVal2 = await storage.read(new StringUtf8("name"), 2);
  t.is(getVal2 ? getVal2.asJs() : undefined, `value::${0}`);
  const getVal3 = await storage.read(new StringUtf8("name"), 3);
  t.is(getVal3 ? getVal3.asJs() : undefined, `value::${3}`);
  const getVal4 = await storage.read(new StringUtf8("name"), 4);
  t.is(getVal4 ? getVal4.asJs() : undefined, `value::${3}`);
  const getVal5 = await storage.read(new StringUtf8("name"), 5);
  t.is(getVal5 ? getVal5.asJs() : undefined, `value::${5}`);
  const getVal6 = await storage.read(new StringUtf8("name"), 6);
  t.is(getVal6 ? getVal6.asJs() : undefined, undefined);
});

function rmdir(dir: string) {
  const files = fs.readdirSync(dir);
  function next(index: number) {
    if (index == files.length) return fs.rmdirSync(dir);
    let newPath = path.join(dir, files[index]);
    const stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      rmdir(newPath);
      next(index + 1);
    } else {
      fs.unlinkSync(newPath);
      next(index + 1);
    }
  }
  next(0);
}

function createStore() {
  return new IndexedStorage(`BFC_${Math.random()}`);
}
