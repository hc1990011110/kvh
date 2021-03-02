import { KVHBase, T } from "./@base";
import { Evt } from "./@evt";
export declare namespace KVHDb {
  interface Database extends Database.Core {
    /**数据库名称 */
    readonly name: string;
    /**当前高度 */
    readonly maxHeight: number;
    /**字典工具 */
    readonly dict: Database.Dictionary;
  }
  export namespace Database {
    /**
     * 核心
     */
    interface Core {
      /**定义钩子
       * 其回调会发生在处理某一个事务时，需要更新key时，会来触发钩子
       * 其本质与AST类似，以计算逻辑来得出值，只不过这里是由js提供计算逻辑
       */
      hook(
        key: KVHBase.Key.Type,
        transactionCallback: (trs: Transaction) => void
      ): Promise<void>;
      /**读取某个key */
      get(
        key: KVHBase.Key.Type,
        candidates?: KVHBase.Key.Candidate.Type[]
      ): Promise<Core.KVHInfo>;
      /**订阅某个key */
      subscribe(
        key: KVHBase.Key.Type,
        candidates?: KVHBase.Key.Candidate.Type[]
      ): Core.Subscriber;
      /**获取当前所有订阅 */
      getAllSubscribe(): Map<string, Core.Subscriber>;

      // /**订阅一组优先级依次递减的key
      //  * 返回一个命中的优先级最高的数据
      //  */
      // subscribeMulti(
      //   keys: {
      //     key: KVHBase.Key.Type;
      //     sync?: boolean;
      //   }[]
      // ): Core.Subscriber;
    }
    namespace Core {
      interface KVHInfo {
        key: KVHBase.Key.Type;
        value: KVHBase.Value.Type;
        height: KVHBase.Height.Type;
      }
      interface Subscriber extends Evt.AttachOnlyEvt<Core.KVHInfo> {
        readonly uid: string;
        readonly key: KVHBase.Key.Type;
        readonly candidates: KVHBase.Key.Candidate.Type[];
        pause(): void;
        resume(): void;
        destory(): void;
      }
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
      /**字典统计信息 */
      interface Stats {
        hash: T.Sha256;
        /**单词数 */
        wordCount: number;
      }
    }

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
        value: KVHBase.Type.Collection.TypeofItemValue<I>
      ): void;
      /**读取值 */
      get(
        key: KVHBase.Type.Collection.TypeofItemKey<I>,
        candidates?: KVHBase.Key.Candidate.Type[]
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
     * 存储管理
     */
    interface Storage {
      /**容量评估 */
      estimate(): Promise<Storage.EstimateInfo>;
      /**对数据进行统计 */
      statistics(
        filters?: KVHBase.Type.Ast<boolean>[]
      ): Promise<Storage.StatisticsInfo>;
      /**清空全部数据 */
      clearAll(): Promise<Storage.ClearInfo>;
      /**合并[minHeight~toHeight)范围内的数据 */
      merge(toHeight: number): Promise<Storage.ClearInfo>;
      /**数据到处（备份） */
      export(maxHeight?: number, minHeight?: number): T.Stream;
    }
    namespace Storage {
      /**
       * 容量评估信息
       */
      interface EstimateInfo {
        /**可用的存储空间 */
        quota: number;
        /**已经使用 */
        usage: number;
      }
      /**
       *  清理信息
       */
      interface ClearInfo {
        byteLength: number;
      }

      /**
       * 统计
       */
      interface StatisticsInfo {
        byteLength: number;
        minHeight: number;
        maxHeight: number;
      }
    }
  }
}
