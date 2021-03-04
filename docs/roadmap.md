# KVH

> 与 PC 节点统一持久化数据的读写

## K·V·H 的基础概念

1.  基础数据类型
    1.  Number：有理数
    1.  String：UTF-8 编码的字符串
    1.  Enum：枚举，比如 Boolean、Int8/16/32/64、Float32/64 等有固定 Bytes 长度的数据都是这类
    1.  Bytes：自由二进制
    1.  Collection：由多个 Key-Value 的集合
    1.  AST：抽象语法树，可以用于执行计算表达式
        1.  可以分析出依赖了哪些 Key
        1.  可以随时中断
1.  Key 的基础类型有 Enum、String、Bytes
    1.  一个 Key 的允许存在多个 Value，这个概念与 Array 不一样，而是说这些 Value 是等价的，可以用“翻译”的来理解这个概念
        > 在获取 key 对应的 value 时，可以调整返回值的优先级。比较特殊的是，AST 默认是异步的，所以默认情况下，可能会先返回次一级的 Value，等异步执行完毕再返回高优先级的。
        > 还是以翻译举例：
        > ui_kvh.subscribe('HELLO_WORD', ['zh-CN', 'autoTranslate-zh-CN', 'en'], updateView);
        > 当然，也是可以强行等待异步执行完毕：
        > ui_kvh.subscribe('HELLO_WORD', ['zh-TW', Await('translate-zh-CN2TW'), 'en'], updateView);​
1.  Value 的基础类型有 Collection、Number、Enum、String、Bytes、AST
1.  Height 的是写入时必须填写的，它能基于此自动进行数据备份。
    1.  prevHeight 上一个记录点的高度
        1.  prevHeight 为 0 时，意味着没有上一个记录点
    1.  updatedHeight 最后更新的高度
        1.  在[prevHeight,updatedHeight]范围内，value 都是不变的
    1.  可以理解成 Height 是一个全局的 key，且所有的 key 都对其有依赖
    1.  一旦全局的 Height 触发更新，就会触发一系列联动计算

## 里程碑

### M1

- KVH-Engine
  - 不需要实现 Type.Ast
  - 底层使用 IndexedDB 实现
  - 数据回滚的 Diff 算法，直接使用 BytesDiff
- Database.Core
- 事务 Transaction
- 不需要实现 Database.Dict
