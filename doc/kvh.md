# KVH

> 可以把kvh理解成一个redis，它是一个状态机。这个状态机由区块数据进行驱动，并可以实现数据回滚，订阅数据变化等操作

### 状态树（engine）

- get(key: string, { address?: string, height?: number })

- hook(key: string, transationCallback: async (trasation) => {  })
  
  钩子，当某个key发生变动，进行复杂操作

- subscribe(key: string, eval)
  
  订阅某个key，eval是订阅顺序的表达式 ['服务节点', '实时节点']

- getAllSub()
  
  获取所有订阅

- startTransation
  
  开启事务，可以修改状态

### 存储（storage）

- export(maxHeight, minHeight)

- merge(toHeight)
  
  合并[minHeight~toHeight)范围内的数据

- clearAll
  
  清空全部数据

- statistics
  
  对数据进行统计

- estimate
  
  容量评估
