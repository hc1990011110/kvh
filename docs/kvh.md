# KVH

> 可以把kvh理解成一个redis，它是一个状态机。这个状态机由区块数据进行驱动，并可以实现数据回滚，订阅数据变化等操作

### 状态树（engine）

- get(key: string, { height?: number })

- hook(key: string, transationCallback: async (trasation) => {  })
  
  钩子，当某个key发生变动，进行复杂操作

- subscribe(key: string, eval)
  
  订阅某个key，eval是订阅顺序的表达式 ['服务节点', '实时节点']

- getAllSub()
  
  获取所有订阅

- startTransation
  
  开启事务，可以修改状态

### 存储（storage）

假设现在有一个需求，要求查询某个地址在某个高度对某个地址投票消耗的权益。

那么如何保证查询最快。

针对上诉例子可以建立一个kv数据库

```typescript
{
    [heightU8a, `${key}-${senderAddress}-${receiveId}`]: equity,
    string
}
db.get(`preRound.{senderAddress}.voteTo.{receiveId}.accEquit`, {
    senderAddress: 'sdfd',
    receiveId: 'fdsf'
});
```

如果只考虑如上情况的话，这样的存储查询效率最高。但是这样的数据是没有关联性的，无法实现查询。
但是假设现在新增一个需求，要查看某个区块高度，某个地址的投票列表。这时候就要遍历所有的key，进行筛选。
针对以上情况，可以建立一个索引库（kvh）进行来增加查询效率。

```typescript
/// 查询某个高度我的投票列表

/// 状态表
{
    voteList: {
        maxHeight: 3000,
        value: {
            [senderAddress]: receiveList
        }
    },
}
或
{
    [voteList-${senderAddress}]: {
        maxHeight: 3000,
        value: [address1, ...]
    },
}
/// diff 表
{
    [${key}-${height}]: {
        preHeight: number,
        diff: Diff,
    }
}
```

查看所有关注者在最近高度（状态）下的投票总数

```typescript
engine.subscribe(
    [
        `${voteList}-${address1}`, // key1
        `${voteList}-${address2}` // key2
    ],
    // 当key1,key2发生变动的时候，（通过对比数据产生新值）触发回调
    (list1, list2) => {
        return list1.length + list2.length;
    },
)
-->
engine.runAst(
`$count{${voteList}-${address1}} + $count{${voteList}-${address2}}`,
(count) => {console.log(count)}
)
```

- export(maxHeight, minHeight)

- merge(toHeight)
  
  合并[minHeight~toHeight)范围内的数据

- clearAll
  
  清空全部数据

- statistics
  
  对数据进行统计

- estimate
  
  容量评估
