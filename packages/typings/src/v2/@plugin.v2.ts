declare namespace KVH2 {
  /**定义插件
   * 提供生命周期钩子
   * 基于插件，开发者可以实现对：数据的压缩算法、自定义数据的存储方案、对数据的统计、以及在开发者工具中的各种拓展
   */
  interface Plugin<KV extends KVH2.DB.KV = any> {
    /**插件的名称 */
    readonly name: string;
    /**插件的关键字信息，用于进一步描述插件 */
    readonly keywords: ReadonlySet<string>;
    /**与其它插件做排序的策略 */
    order(otherPlugin: Plugin<KV>): 0 | 1 | -1;

    /**自定义key转bytes */
    keyToBytes?<K extends KVH2.DB.GetKey<KV>>(
      piper: Plugin.Piper<
        {
          key: KVH2.DB.KeyUnit<K>;
          keyBytes?: Uint8Array;
        },
        { keyBytes: Uint8Array }
      >,
    ): Util.PromiseMaybe<Uint8Array | undefined>;
    /**自定义value转bytes */
    valueToBytes?<K extends KVH2.DB.GetKey<KV>>(
      piper: Plugin.Piper<
        {
          value: KVH2.DB.GetValByKey<KV, K>;
          valueBytes?: Uint8Array;
          key: KVH2.DB.KeyUnit<K>;
          height: number;
        },
        { valueBytes: Uint8Array }
      >,
    ): unknown;
    /**在准备写入数据库前 */
    transactionStore?<K extends KVH2.DB.GetKey<KV>>(
      piper: Plugin.Piper<
        {
          transaction: KVH2.DB.Transaction;
          key: KVH2.DB.KeyUnit<K>;
          keyBytes: Uint8Array;
          value: KVH2.DB.GetValByKey<KV, K>;
          valueBytes: Uint8Array;
          height: number;
        },
        { keyBytes: Uint8Array; valueBytes: Uint8Array }
      >,
    ): unknown;
    /**数据读出来时 */
    transactionLoad?<K extends KVH2.DB.GetKey<KV>>(
      piper: Plugin.Piper<
        {
          key: KVH2.DB.KeyUnit<K>;
          keyBytes: Uint8Array;
          valueBytes: Uint8Array;
          value?: KVH2.DB.GetValByKey<KV, K>;
          height: number;
        },
        { value: KVH2.DB.GetValByKey<KV, K> }
      >,
    ): unknown;
  }

  namespace Plugin {
    // type Params<I> = Readonly<I>;
    type Piper<I, O> = { params: Readonly<I>; pipe: (out?: O) => void };
  }
}
