// 1. 一个继承自 Player 的新对象 p1 被创建了
// 2. p1.__proto__ = Player.prototype
// 3. 将this 指向新创建的对象 p1
// 4. 返回这个新对象 p1


function objectFactory() {
  let o = new Object();

  let FunctionConstructor = [].shift.call(arguments);

  o.__proto__ = FunctionConstructor.prototype
  // Object.getPrototypeOf

  let resultObject = FunctionConstructor.apply(o, arguments) // apply传递参数数组，此时的arguments是不包含Player的参数

  return typeof resultObject === 'object' ? resultObject : o;
}


function Player(name) {
  this.name = name;
}

const p1 = objectFactory(Player, '秋裤')
console.log(p1)

