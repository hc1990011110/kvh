# 状态机

## 构成

- 事务管理
  
  需要有一个promiseOut数组，每次操作查看是否有正在操作的事务，如果有就创建一个promiseOut插入到数组中
  
  等到事务操作完成就在promiseOut数组，移除一个promiseOut并resolve。

- AST语言
  
  主要用来操作状态树，修改添加属性。能够具有回滚的特性。
  
  ```typescript
  const art = new Ast.Builder();
  const opt = ast.varInt('a', 0);
  ast.add('a', 1);
  ast.toString(); // int a 0;add a 1;
  stateMachine.runAst(ast);
  stateMachine.runAst(ast.toString());
  ```

- 实际的状态树
  
  返回了一个proxy对象，对该对象进行操作时，会出发属性`change`的事件。


