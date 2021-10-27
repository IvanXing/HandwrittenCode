const obj1 = {
  age: 20,
  name: 'xxx',
  address: {
    city: 'beijing'
  },
  arr: ['a', 'b', 'c']
}


const obj2 = deepClone(obj1)
console.log(obj2)
console.log(obj2 === obj1)

/**
 * 深拷贝
 */

function deepClone(obj = {}) {

  // obj 是 null ，或者不是对象和数组，直接返回
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  // 初始化返回结果，初始化 数组 or 对象
  let result
  if (obj instanceof Array) {
    result = []
  } else {
    result = {}
  }

  for (let key in obj) {
    // 保证 key 不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 递归调用
      result[key] = deepClone(obj[key])
    }
  }

  return result

}


// for (let key in obj) {}  遍历出来的是key value  数组 对象都可以
// for (let key of obj) {}  迭代出来的是 值，只能迭代 Array，Map，Set，String，TypedArray，arguments 