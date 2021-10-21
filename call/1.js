// call() 指定this以及参数，并调用

Function.prototype.call2 = function(context) {
  var context = context || window
  context.fn = this;

  var args = [];
  // 取除了this 之外的第二个和第三个参数
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }

  // context.fn(args.join(','))
  // args 会自动调用 Array.toString()
  var result = eval('context.fn('+ args +')')  
  
  delete context.fn;
  return result;
}

// 测试一下
var foo = {
  value: 1
};
// 无返回值测试用例
function bar1(name, age) {
  console.log('执行=>', name, age, this)
  console.log(name)
  console.log(age)
  console.log(this.value);
}
// 有返回值测试用例
function bar2(name, age) {
  console.log(this.value);
  return {
      value: this.value,
      name: name,
      age: age
  }
}

bar1.call2(foo, 'kevin', 18); 
bar2.call2(foo, 'paul', 16);


/*
** 没有接收额外参数
*/
// Function.prototype.call2 = function(context) {
//   context.fn = this;
//   context.fn();
//   delete context.fn;
// }

// var foo = {value: 1}

// function bar() {
//   console.log(this.value)
// }

// bar.call2(foo)