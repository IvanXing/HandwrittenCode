// 把需要执行的函数fn，和 obj 关联在一起 obj.fn()

// 优化： 1. context 不传的情况
//       2. key值和赋值对象的key冲突
//       3. 传递来的对象context 是不是引用类型， 能不能被赋值
Function.prototype.call3 = function (context, ...params) {   // 剩余参数不固定

  if(!/^(object|function)$/.test(typeof context)) {  // 不是引用类型
    context = Object(context)
  }

  var context = context || window
  var key = Symbol('KEY')

  context[key] = this;
  let result = context[key](...params);
  delete context[key];

  return result
}


Function.prototype.call2 = function (context, ...params) {   // 剩余参数不固定
  // fn 调用了 call2，此时方法中的this 就是fn，需要执行的函数
  // context 传入的是 需要绑定的 this
  // params -> [10, 20]
  console.log(this, params)

  context.fn = this;
  let result = context.fn(...params);
  delete context.fn;

  return result
}

// 思路：let result = obj.fn(10, 20)  把fn属性 放到 obj 中

let obj = {
  name: 'paul',
  age: 11
}

function fn(x, y) {
  console.log(this)
  return x + y;
}

let result = fn.call3(obj, 10,20)
console.log(result)







// 装箱？拆箱？ 把基本类型 变成引用

// let n = 100;
// n.constructor => Number()
// new n.constructor(100)  => Number{__protp__: Number, PrimitiveValue: 100}

// let x = new Number(10)
// x.valueOf();  // 10

// Number String Boolean 同理可以new 创造对应的引用


// 构造函数不能处理 Symbol 和 bigInt 不能被new
// 用Objct包裹
// let q = Symbol()
// Object(q)

// Object(10).valueOf()  => 10


