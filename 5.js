(function() {
  // 自定义一个Promise类，实现内置Promise的重写（PromiseAplus）
  // https://promisesaplus.com/

  function Promise(executor) {

    // 1. 必须保证executor是一个函数
    if(typeof executor !== 'function') {
      throw new TypeError('传入值不是函数')
    }

    // 4. self:存储的是promise实例，供下面使用，否则下面直接用this是window，定义初始状态和值
    var self = this;
    self.PromiseState = 'pending';
    self.PromiseResult = undefined;

    // 3. 参数是函数，执行resolve/reject就是修改当前实例的状态和结果
    var resolve = function resolve(value) {
      if(self.PromiseState === 'pending') {  // 状态只能改一次，只能从pending改到
        self.PromiseState = 'fulfilled';   // 此处不用this，外部调用resolve，this是window，此处应该改变实例状态，箭头函数可以用this，继承上下文 
        self.PromiseResult = value;
      }
    };
    var reject = function reject(reason) {
      if(self.PromiseState === 'pending') {
        self.PromiseState = 'rejected';
        self.PromiseResult = reason;
      }
    };

    // 2. 立即执行executor函数
    try{  //如果函数执行报错，则promise状态也要改为失败态
      executor(resolve, reject);
    }catch(err) {
      reject(err)
    }

  }

  // 5. 重写原型，以及then方法
  Promise.prototype = {
    customize: true,  // 标记是否自定义
    constructor: Promise,

    then: function(onfulfilled, onrejected) {
      // 根据状态不同，执行不同的方法，执行then时候，resolve是同步，知道状态，不是立即执行，而是异步操作（定时器，不设置等待时间）
      var self = this;
      switch(self.PromiseState) {
        case "fulfilled":
          setTimeout(function() {
            onfulfilled(self.PromiseResult);
          })
          break;
        case "rejected":
          setTimeout(function() {
            onrejected(self.PromiseResult);
          })
          break
      }
    },

    catch: function() {},
  }

  window.Promise = Promise;
})();


let p1 = new Promise((resolve, reject) => {
  resolve('OK')
  reject('NO')
});


p1.then(value => {
  console.log('成功', value)
}, reason => {
  console.log('失败', reason)
});
console.log(1)  // 异步then 先输出1
