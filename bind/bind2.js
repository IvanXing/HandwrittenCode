
Function.prototype.bind2 = function (context, ...params) {
  console.log('222', ...params)
  var self = this
  return function(...args) {
    newParams = params.concat(args)
    return self.call(context, ...newParams)
  }
}


// 思路  let newFunc = function () { fn.call(obj, 10, 20) }  执行newFunc 才执行call

let obj = {
  name: 'paul',
  age: 11
}

function fn(x, y, p, q) {
  console.log(this, x, y, p, q)
  return x + y + p + q;
}

let newFunc = fn.bind2(obj, 2)
console.log(newFunc(10, 20, 30))