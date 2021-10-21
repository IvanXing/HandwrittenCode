Function.prototype.apply2 = function (context, arr) {
  var context = context || window;
  context.fn = this;

  var result;
  if(!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (let i = 0; i < arr.length; i++ ) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn;
  return result;

}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.apply2(obj, ['sam', 12]))



/*
** 利用解构
*/
Function.prototype.apply = function (ctx,arr) {
  // 在浏览器中需要指定为 window，在 node 环境中，则为 空对象
  ctx = ctx || typeof window === 'undefined' ? {} : window
  ctx.func = this

  let result
  if (!arr) {
      result = ctx.func()
  } else {
     result = ctx.func(...arr)
  }

  delete ctx.func
  return result
}
