import { BFChainKVH as KVH, TYPE_FLAG } from "@kvh/typings";
import {
  BoolFactory,
  Int8,
  Int8Factory,
  EnumFactory,
  StringUtf8,
  StringUtf8Factory,
  StringUtf8FactoryCtor,
} from "../type";

export class EngineBuilder<
  TM extends KVH.Engine.Engine.TransactionStorage.KeyVal = never,
  FM extends KVH.Engine.Engine.Builder.FlagedFactory = never
> implements KVH.Engine.Engine.Builder<TM, FM> {
  defineType<F extends number, T extends KVH.Base.Value.Factory>(
    typeFlag: F,
    Factory: T,
  ): KVH.Engine.Engine.Builder<TM, FM | KVH.Engine.Engine.Builder.FlagedFactory<F, T>> {
    throw new Error("Method not implemented.");
  }
  defineKey<K extends KVH.Base.Key.Type, F extends KVH.Engine.Engine.Builder.FlagedType.GetFlag<FM>>(
    key: K,
    typeFlag: F,
  ): KVH.Engine.Engine.Builder<
    KVH.Engine.Engine.TransactionStorage.KeyVal<
      K,
      KVH.Base.Type.Unit.FactoryReturn<KVH.Engine.Engine.Builder.FlagedType.GetFactoryByFlag<FM, F>>
    >,
    FM
  > {
    throw new Error("Method not implemented.");
  }

  toEngine(): Promise<KVH.Engine.Engine<TM>> {
    throw new Error("Method not implemented.");
  }
}

type ColorTypeMap =
  //   | KVH.Base.Type.TypeMap<"black", Int8<-1, "black">>
  //   | KVH.Base.Type.TypeMap<"white", Int8<0, "white">>
  KVH.Base.Type.NamedType<"red", Int8<1, "red">> | KVH.Base.Type.NamedType<"blue", Int8<2, "blue">>;
//   | KVH.Base.Type.TypeMap<"green", Int8<3, "green">>;

class ColorFactoryCtor extends EnumFactory<ColorTypeMap> {
  create(
    js: KVH.Base.Type.Unit.GetType<KVH.Base.Type.NamedType.GetValue<ColorTypeMap>>,
  ): KVH.Base.Type.NamedType.GetValue<ColorTypeMap> {
    type Res = KVH.Base.Type.NamedType.GetValue<ColorTypeMap>;
    let res: Res | undefined;
    if (js === 1) {
      res = new Int8<typeof js, "red">(js);
    } else if (js === 2) {
      res = new Int8<typeof js, "blue">(js);
    }
    if (res === undefined) {
      throw new TypeError(`Illegal value ${js}`);
    }
    return res;
  }
  getByName<K extends KVH.Base.Type.NamedType.GetName<ColorTypeMap>>(
    name: K,
  ): KVH.Base.Type.NamedType.GetValueByName<ColorTypeMap, K> {
    type Res = KVH.Base.Type.NamedType.GetValueByName<ColorTypeMap, K>;
    let res: Res | undefined;
    if (name === "red") {
      res = new Int8<1, typeof name>(1) as Res;
    } else if (name === "blue") {
      res = new Int8<2, typeof name>(2) as Res;
    }
    if (res === undefined) {
      throw new TypeError(`Illegal name ${name}`);
    }
    return res;
  }
}
const ColorFactory = new ColorFactoryCtor();

class CountryFactoryCtor extends StringUtf8FactoryCtor<StringUtf8<"China"> | StringUtf8<"U.S"> | StringUtf8<"Japen">> {}
const CountryFactory = new CountryFactoryCtor();

export const enum CUSTOM_TYPE_FLAG {
  Color = 20,
  Country,
}

async function test() {
  const engine = await new EngineBuilder()
    .defineType(TYPE_FLAG.StringUtf8, StringUtf8Factory)
    .defineType(TYPE_FLAG.Bool, BoolFactory)
    .defineType(TYPE_FLAG.Int8, Int8Factory)
    .defineType(CUSTOM_TYPE_FLAG.Color, ColorFactory)
    .defineType(CUSTOM_TYPE_FLAG.Country, CountryFactory)
    .defineKey(new StringUtf8("name"), TYPE_FLAG.StringUtf8)
    .defineKey(new StringUtf8("age"), TYPE_FLAG.Int8)
    .defineKey(new StringUtf8("home"), CUSTOM_TYPE_FLAG.Country)
    .defineKey(new StringUtf8("skin"), CUSTOM_TYPE_FLAG.Color)
    .toEngine();
  const name = await engine.get(new StringUtf8("name"));
  const age = await engine.get(new StringUtf8("age"));
  const skin = await engine.get(new StringUtf8("skin"));
  const home = await engine.get(new StringUtf8("home"));
  const transaction = await engine.openTransaction(2);
  transaction.writer.set(new StringUtf8("skin"), ColorFactory.getByName("red"));
  transaction.writer.set(new StringUtf8("home"), CountryFactory.create("China"));
}
