declare namespace KVH2 {
  interface KeyBuilder<AliasType extends KB.AT = KB.AT, TemplateValue extends KB.TV = KB.TV> {
    build<Template extends DB.GetKey<TemplateValue>>(
      key: Template,
      params: KB.BuildKeyParams<Template, AliasType>,
    ): Util.PromiseMaybe<DB.KeyUnit<KB.DatabaseKey<Template>>>;
    toDatabase(): Util.PromiseMaybe<Database<KB.DatabaseKeyValue<AliasType, TemplateValue>>>;
  }
  namespace KB {
    type TV<K extends string = string, V extends DB.ValueUnit = DB.ValueUnit> = { key: K; val: V };
    type GetTemplate<T> = T extends TV<infer K, infer _> ? K : never;
    type GetValue<T> = T extends TV<infer _, infer V> ? V : never;
    type GetValueByTemplate<T, K> = T extends TV<infer Key, infer Value> ? (K extends Key ? Value : never) : never;
    // type GetTemplateByValue<T, V> = T extends TV<infer Key, infer Value> ? (Value extends V ? Key : never) : never;

    type AT<K extends string = string, V = unknown> = { key: K; val: V };
    type GetAlias<T> = T extends AT<infer Alias, infer _> ? Alias : never;
    type GetType<T> = T extends AT<infer _, infer Type> ? Type : never;
    type GetTypeByAlias<T, K> = T extends AT<infer Alias, infer Type> ? (K extends Alias ? Type : never) : never;
    // type GetAliasByType<T, V> = T extends AT<infer Key, infer Type> ? (Type extends V ? Key : never) : never;

    interface Factory<AliasType extends KB.AT = never, TemplateValue extends TV = never> {
      $defineAliasType<Alias extends string, Type>(name?: Alias, type?: Type): Factory<AliasType | KB.AT<Alias, Type>>;
      $defineTemplateValue<Template extends string, Value extends DB.ValueUnit>(
        template?: Template,
        value?: Value,
      ): Factory<AliasType, TemplateValue | TV<Template, Value>>;
      toBuilder(): KeyBuilder<AliasType, TemplateValue>;
    }

    type BuildKeyParams<Template, AliasType extends AT> = Template extends `${infer Left}.${infer Right}`
      ? BuildKeyParams.Unit<Left, AliasType> & BuildKeyParams<Right, AliasType>
      : BuildKeyParams.Unit<Template, AliasType>;
    namespace BuildKeyParams {
      type Unit<Template, AliasType extends AT> = Template extends `{${infer Key}:${infer Alias}}`
        ? { [K in Key]: GetTypeByAlias<AliasType, Alias> }
        : {};
    }

    type DatabaseKey<Template> = Template extends `${infer Left}.${infer Right}`
      ? `${DatabaseKey.Unit<Left>}.${DatabaseKey<Right>}`
      : DatabaseKey.Unit<Template>;
    namespace DatabaseKey {
      type Unit<Template> = Template extends `{${infer _}}` ? `{${string}}` : Template;
    }
    type DatabaseKeyValue<AliasType extends AT, TemplateValue extends TV> = {
      [Template in GetTemplate<TemplateValue>]: DatabaseKeyValue.Unit<Template, TemplateValue>;
    }[GetTemplate<TemplateValue>];

    namespace DatabaseKeyValue {
      type Unit<Template extends string, TemplateValue extends TV> = TV<
        DatabaseKey<Template>,
        DB.GetValByKey<TemplateValue, Template>
      >;
      // type ObjIgnoreKeys<O extends {}> = O[keyof O];
    }
  }

  interface Database<T extends DB.KV = DB.KV> {
    open(height: number): Util.PromiseMaybe<DB.Transaction<T>>;
    get<K extends DB.GetKey<T>>(key: DB.KeyUnit<K>, height?: number): Util.PromiseMaybe<DB.GetResult<T, K> | undefined>;
    sub<K extends DB.GetKey<T>>(key: DB.KeyUnit<K>): DB.Subject<DB.GetResult<T, K>>;
    hook<K extends DB.GetKey<T>>(
      key: DB.KeyUnit<K>,
      pull: (height: number, key: K) => unknown,
    ): Util.PromiseMaybe<void>;
  }
  namespace DB {
    type KV<K extends string = string, V extends ValueUnit = ValueUnit> = { key: K; val: V };
    type GetKey<T> = T extends KV<infer K, infer _> ? K : never;
    type GetVal<T> = T extends KV<infer _, infer V> ? V : never;
    type GetValByKey<T, K> = T extends KV<infer Key, infer Value> ? (K extends Key ? Value : never) : never;
    type GetKeyByVal<T, V> = T extends KV<infer Key, infer Value> ? (Value extends V ? Key : never) : never;

    interface KeyUnit<S extends string = string> {
      readonly uri: S;
      toString(): string;
      toBytes(): Uint8Array;
    }
    interface ValueUnit {
      toBytes(): Uint8Array;
    }

    type GetResult<T, K> = { key: K; value: DB.GetValByKey<T, K>; height: number; prevHeight: number };
    interface Subject<V> extends Evt.Attacher<V> {
      readonly uri: string;
      close(): void;
    }

    /**事务 */
    interface Transaction<T extends KV = KV> {
      readonly height: number;
      load<K extends DB.GetKey<T>>(key: K, height?: number): Util.PromiseMaybe<DB.GetValByKey<T, K>>;
      store<K extends DB.GetKey<T>>(key: K, value: DB.GetValByKey<T, K>): Util.PromiseMaybe<void>;
      add<K extends DB.GetKeyByVal<T, number>>(
        key: K,
        value: DB.GetValByKey<T, K>,
      ): Util.PromiseMaybe<DB.GetValByKey<T, K>>;
    }
  }

  interface DataViwer {}
}
declare namespace Evt {
  interface Evt<T> extends Attacher<T>, Poster<T> {}
  interface Attacher<V> {
    attach(cb: (data: V) => unknown): void;
    detach(cb: (data: V) => unknown): boolean;
  }
  interface Poster<V> {
    post(data: V): void;
  }
}
declare namespace Util {
  type PromiseMaybe<T> = T | PromiseLike<T>;
  type Ref<T> = { content: T };
}
