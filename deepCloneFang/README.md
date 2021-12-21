## 创建目录

## yarn init -y

## 把依赖拷贝进 package.json 文件，再 yarn install



深拷贝
● b是a的拷贝，b没有引用任何a的部分
● 写深拷贝，考虑：数据的类型，数据规模，性能要求，运行环境

JSON序列化和反序列化
var a = {
	b: 1,
  c: [1, 2, 3],
  d: {d1: 'ddd1', d2: 'ddd2'}
}

var a2 = JSON.parse(JSON.stringfy(a))
缺点
● 不支持函数，a中有元素是函数，会被忽略
● 不支持undefined，会被忽略，JSON只支持null
● 不支持环状引用，会直接报错，JSON只支持树状，不支持环状，var a = { name: 'a' }; a.self = a 操作会报错
● 不支持Date类型，new Date()，操作后会直接变成ISO 8601字符串，时间字符串 '2019-09-03T12:47:01.502Z'
● 不支持正则表达式，regexp: /hi/，复制会变成空对象
● 不支持 Symbol，直接忽略

递归深克隆
思路：递归
● 节点的7种类型，6种基本类型 + Object
  ○ number / string / boolean / undefined / null / symbol / Object
  ○ 如果是基本类型就直接拷贝
● 如果是Object,就分情况讨论
  ○ 普通Object，用for in，注意排除原型上的属性
  ○ 数组Array， array初始化
  ○ 函数function，怎么拷贝，遇到闭包
  ○ 日期Date，怎么拷贝

搭建测试环境
// src/index.js
function deepClone() {}
module.exports = deepClone;

// test/index.js
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai)

const assert = chai.assert;
const deepClone = require("../src/index");

describe('deepClone', () => {
  it("是一个函数", () => {
    assert.isFunction(deepClone)
  });
});

// package.json
{
  "scripts": {
    "test": "mocha test/**/*.js"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "mocha": "^6.2.0",
    "sinon": "^7.4.1",
    "sinon-chai": "^3.3.0"
  }
}
考虑是普通对象，还是数组，还是函数
function deepClone(source) {
  if (source instanceof Object) {
    let dist;
    if (source instanceof Array) {
      dist = new Array();
    } else if (source instanceof Function) {
      dist = function () {
        return source.apply(this, arguments)
      }
    } else {
      dist = new Object();
    }
    for (let key in source) {
      dist[key] = deepClone(source[key])
    }
    return dist;
  }
  return source;
}
检测环
let cache = [];
function deepClone(source) {

  if (source instanceof Object) {

    let cacheDist = findCache(source);
    if (cacheDist) {
      return cacheDist;
    } else {

      let dist;
      if (source instanceof Array) {
        dist = new Array();
      } else if (source instanceof Function) {
        dist = function () {
          return source.apply(this, arguments)
        }
      } else {
        dist = new Object();
      }
      // 加入缓存
      cache.push([source, dist])
      for (let key in source) {
        dist[key] = deepClone(source[key])
      }
      return dist;
    }

  }

  return source;
}

function findCache(source) {
  for (let i = 0; i < cache.length; i++) {
    if (cache[i][0] === source) {
      return cache[i][1]
    }
  }
  return undefined;
}
考虑爆栈
● chrome的栈大约1w2k，超过就会爆栈
● 思路是用数组来存储，此处暂不考虑 
拷贝正则RegExp和日期
// 正则的两个属性 source 和 flags

const a = new RegExp("hi\\d+", "gi")
const a = /hi\d+/gi;

a.source  // 'hi\\d+'
a.flags //  'gi'

// 日期的 getTime() 属性，可以对比是否日期值相同  
const a = new Date();
assert(a.getTime() === a2.getTime());  // 1640083316335
Object.create()
var a = {name: 'hi'}
var a2 = Object.create(a)

// a 会挂在 a2 的__proto__上
每次都创建一个新的cache，不影响别的
● 创建一个class