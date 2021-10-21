// bind 创建一个新函数，第一个参数是this

Function.prototype.bind2 = function (context) {
  var self = this;

  // 获取bind2函数从第二个参数到最后一个参数， 从第一个开始，不写为全浅拷贝
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    // 这个时候的arguments是指bind返回的函数传入的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof fNOP ? this : context, arge.concat(bindArgs));
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}




var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 