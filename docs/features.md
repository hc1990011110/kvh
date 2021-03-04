# KVH任务清单

### 第一阶段

- [ ] 用lerna来管理项目
  
  文件夹结构  stateMachine，storage，engine，typings ，test

- [ ] 状态机的订阅，hook等操作

- [ ] 状态候选词的方案及实现

- [ ] storage 抽象出来（可使用indexeddb,lervedb, filesystem）

- [ ] engine 继承stateMachine，设置并订阅key值变化，进行存储,合并和导出

- [ ] 实现engine的事务的管理

- [ ] 项目工程相关

  - [x] 添加 VitePress 作为文档工具
  - [x] 使用 github label


### 第二阶段

- [ ] AST协议定义及实现

- [ ] 实现跨线程通讯订阅（webWorker）

- [ ] engine字典


