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

  // 9. 执行不报错，统一处理方法，当前promise实例，执行结果x
  // 9.1 统一处理基于then返回新实例的成功和失败
  function reslovePromise(promise, x, resolve, reject) {
    if (x===promise) {
      throw new TypeError('循环了兄弟，返回值和创建的新实例是同一个')
    }
    // 9.2 判断x是否符合要求
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
      try {
        var then = x.then;
        if (typeof then === 'function') {
          // 9.3 返回结果是一个新的promise实例（不一定是自己构建的，也有可能是别人构建的）
          then.call(x, function(y) {}, function(x) {})
        } else {
          reslove(x)
        }
      } catch(err) {
        reject(err);
      }
    } else {
      reslove(x)
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

      // 8. then方法会返回一个新的Promise实例， self是原始的promise实例， promise是新返回的promise实例【reslove, reject执行控制成功失败】
      // 8.1 新返回promise执行成功还是失败，由onfulfilled和onrejected是否报错，以及新promise返回结果决定
      var self = this;
      var promise = new Promise(function(reslove, reject) {
        switch(self.PromiseState) {
          case "fulfilled":
            setTimeout(function() {
              try {
                var x = onfulfilled(self.PromiseResult);
                // 9.
                reslovePromise(promise, x, reslove, reject)
              } catch(err) {
                reject(err);
              }
            })
            break;
          case "rejected":
            setTimeout(function() {
              try {
                var x = onrejected(self.PromiseResult);
                // 9.
                reslovePromise(promise, x, reslove, reject)
              } catch(err) {
                reject(err);
              }
            })
            break;
          default:
            // 8.2 这样写的目的：把成功和失败放到不同容器中，后期知道状态，通知某类型容器方法执行
            // self.onFulfilledCallbacks.push(onfulfilled);
            // self.onRejectedCallbacks.push(onrejected);
 
            // 8.3 存成数组匿名函数，好处是可以接收返回值
            // 向容器中存储匿名函数，后期状态改变后，先把匿名函数执行（给匿名函数传递promiseResult）
            // 在匿名函数中，把最后需要执行的onfulfilled 和onrejected执行，可以监听报错和返回值
            self.onFulfilledCallbacks.push(function(PromiseResult) {
              try {
                var x = onfulfilled(PromiseResult);
                // 9.
                reslovePromise(promise, x, reslove, reject)
              } catch(err) {
                reject(err);
              }
            });
            self.onRejectedCallbacks.push(function(PromiseResult) {
              try {
              var x = onrejected(PromiseResult);
              // 9.
              reslovePromise(promise, x, reslove, reject)
              } catch(err) {
                reject(err);
              }
            });
        }
      });
      return promise;
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
