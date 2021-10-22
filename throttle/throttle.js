// 节流
// 一段频繁操作中，可以触发多次，但是触发频率由自己来指定

/*
* @params
*   func: 最后要触发的执行函数
*   wait: 触发的频率
* @return
*   可被调用执行的函数
*/
function throttle(func, wait = 300) {

  let timer = null;
  let previous = 0;  // 记录上次操作时间

  return function anonymous(...params) {
    let now = new Date();
    let remaining = wait - (now - previous);  // 记录还差多久达到一次触发频率
    if (remaining <= 0) {
      window.clearTimeout(timer);  // 能执行时候清掉
      previous = now;
      func.call(this, ...params);
    } else if (!timer) {              // 没有定时器再设置
      timer = setTimeout(()=>{
        timer = null;
        previous = new Date();
        func.call(this, ...params);
      },remaining)
    }
  }

}



function handle () {
  console.log('OK')
  // // 设置定时器
  // setTimeout(()=>{
  //   console.log('OK')
  // }, 1000)
}

// 每一次滚动，浏览器有最快反应时间(5-6ms, 13-17ms)，只要反应过来就触发一次
// window.onscroll = handle;  

window.onscroll = throttle(handle)

// window.onscroll = fuction anonymous() {} 自己控制频率
 


// 滚动，输入过程中模糊匹配 用节流
// 点击 用防抖
