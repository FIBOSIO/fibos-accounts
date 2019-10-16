# fibos-accounts 模块


## 介绍

fibos-accounts 模块，依赖于 [fibos-tracker](https://github.com/FIBOSIO/fibos-tracker) 模块，存储 FIBOS、EOS 链上所有的账户信息，包括链上账户、账户对应公钥。依赖于 [fib-app](https://github.com/fibjs/fib-app) 框架和默认 model 定义，可以快速部署属于自己的区块链账户系统服务。

## 安装

```shell
npm install fibos-accounts
```

## 使用

```javascript
...
const Tracker = require("fibos-tracker");

Tracker.Config.DBconnString = "sqlite:./chain.db";

const tracker = new Tracker();
tracker.use(require("fibos-accounts"));
...
```

[实例代码](./examples/)

## 默认表结构定义

accounts 表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int | 自增id |
| name | String | 账户名 |
| creator | String | 账户创建者 |
| created | Date | 账户创建日期 |
| createdAt | Date | Mysql 插入时间 |
| updatedAt | Date | Mysql 更新时间 |

permissions 表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int | 自增id |
| pub_key | String | 公钥 |
| permission | String | 权限名 | 
| account_id | int | 关联账户 id |
| createdAt | Date | Mysql 插入时间 |
| updatedAt | Date | Mysql 更新时间 |