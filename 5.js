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
    // 5.3 加两个属性，存储then方法，还未知道状态先存起来
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    // 6. 封装 resolve和reject方法
    var run = function run(state, result) {
      if(self.PromiseState !== 'pending') return
      self.PromiseState = state;
      self.PromiseResult = result;
      // 7. 执行resolve/reject时，会立即更改状态信息，但是不会立即通知方法执行（有异步效果）
      setTimeout(()=> {
        var arr = state === 'fulfilled' ? self.onFulfilledCallbacks : self.onRejectedCallbacks;
        for(var i = 0; i < arr.length; i++) {
          let itemFunc = arr[i];
          if(typeof itemFunc === 'function') {
            itemFunc(self.PromiseResult);
          }
        }
      })
    }

    // 3. 参数是函数，执行resolve/reject就是修改当前实例的状态和结果
    var resolve = function resolve(value) {
      run('fulfilled', value)
    };
    var reject = function reject(reason) {
      run('rejected', reason)
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
      // 5.1 根据状态不同，执行不同的方法，执行then时候，resolve是同步，知道状态，不是立即执行，而是异步操作（定时器，不设置等待时间）
      // 5.2 如果执行then时，还不清楚实例状态(executor中是一个异步操作，先then，后改状态)，此时应该先把基于then传入的方法存起来
      // 5.4 后期resolve/reject函数更改状态时候，通知存储的then方法执行
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
          break;
        default:
          self.onFulfilledCallbacks.push(onfulfilled);
          self.onRejectedCallbacks.push(onrejected);
      }
    },

    catch: function() {},
  }

  window.Promise = Promise;
})();


let p1 = new Promise((resolve, reject) => {
  setTimeout(()=> {
    resolve('OK')
    console.log(2)  // 7. resolve是异步，应该先输出2
  }, 1000)
});


p1.then(value => {
  console.log('成功', value)
}, reason => {
  console.log('失败', reason)
});

p1.then(value => {
  console.log('成功', value)
}, reason => {
  console.log('失败', reason)
});

p1.then(value => {
  console.log('成功', value)
}, reason => {
  console.log('失败', reason)
});
console.log(1)  // 异步then 先输出1
