import { KVHBase, T } from "./@base";
export declare namespace KVHDb {
  interface Database {
    /**数据库名称 */
    readonly name: string;
    /**当前高度 */
    readonly maxHeight: number;
    readonly dict: Database.Dictionary;
    readonly sub: Database.Subscription;
  }
  export namespace Database {
    /**
     * 核心
     */
    interface Core {
      /**定义key */
      keyHook(key: KVHBase.Key.Types): Promise<void>;
    }
    /**
     * 数据库字典
     * 可以用于优化数据传输
     */
    export interface Dictionary {
      /**与远端数据库协商使用字典 */
      use(dict: string): Promise<void>;
      /**检查是否有字典 */
      exist(dict: string): Promise<undefined | Dictionary.Stats>;
      /**定义字典 */
      define(
        dict: string,
        words: KVHBase.Type.Unit[]
      ): Promise<Dictionary.Stats>;
      /**往字典中追加单词 */
      push(dict: string, word: KVHBase.Type.Unit): Promise<boolean>;
    }
    export namespace Dictionary {
      interface Stats {
        hash: T.Sha256;
      }
    }

    /**
     * 数据库订阅
     */
    interface Subscription {}

    /**
     * 数据库事务
     */
    interface Transaction<
      I extends KVHBase.Type.Collection.Item = KVHBase.Type.Collection.Item
    > {
      /**使用的字典名称 */
      readonly dict: string;
      /**事务高度 */
      readonly height: KVHBase.Height.Type;
      /**设置值 */
      set(
        key: KVHBase.Type.Collection.TypeofItemKey<I>,
        value: KVHBase.Type.Collection.TypeofItemValue<I>,
        candidates?: KVHBase.Candidate.Types[]
      ): void;
      /**读取值 */
      get(
        key: KVHBase.Type.Collection.TypeofItemKey<I>,
        candidates?: KVHBase.Candidate.Types[]
      ): Promise<KVHBase.Type.Collection.TypeofItemValue<I>>;
      /**
       * 将这个事务变动的数据转化成 集合
       */
      toCollection(): KVHBase.Type.Collection<I>;

      /**
       * 保存事务
       * 将会写入到数据库中
       */
      save(): Promise<void>;
      /**
       * 是否有未保存的数据
       */
      readonly hasUnSave: boolean;
    }

    /**
     * 存储信息
     */
    interface Storage {
      statistics(): Promise<Storage.StatisticsInfo>;
      clearAll(): Promise<void>;
      backup(maxHeight: number, minHeight: number): T.Stream;
    }
    namespace Storage {
      /**
       * 统计
       */
      interface StatisticsInfo {}
    }
  }
}
