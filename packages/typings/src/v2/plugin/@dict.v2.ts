declare namespace KVH2 {
  /**
   * ## 字典插件
   * 默认情况下，kvh的Key与Value都是直接的全量存储。
   * 但其实很多数据都可以通过建立字典，来大量节约存储空间。
   */
  type DictPlugin<KV extends KVH2.DB.KV = any> = KVH2.Plugin.Required<
    'keyToBytes' | 'valueToBytes' | 'bytesToKey' | 'bytesToValue',
    KV
  >;
  //     Required<KVH2.Plugin<KV>, 'keyToBytes'> & {
  //     /**插件的关键字信息，用于进一步描述插件 */
  //     readonly keywords: ReadonlySet<'dict' | never>;
  //     //   readonly db
  //     // keyToBytes(): void;
  //   };
}
