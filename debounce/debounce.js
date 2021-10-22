// 防抖
// 对于频繁触发某操作，只识别一次

/*
* @params
*   func: 最后要触发的执行函数
*   wait: 设定频繁的期限
*   immediate: 是否立即执行，默认多次操作识别最后一次，但是immediate = true，识别第一次
* @return
*   可被调用执行的函数
*/
// 当前点击，等待wait，看是否触发第二次，如果没有触发第二次，执行func，如果触发了第二次，从这次开始等待
function debounce(func, wait = 300, immediate = false) {
  let timer = null;

  return function(...params) {

    let now = immediate && !timer;  // 是否当前点击是立即执行

    // 每次点击都把之前的清除，重新设置
    clearTimeout(timer)

    timer = setTimeout(()=>{
      timer = null;
      !immediate ? func.call(this, ...params) : null  // 触发时候的this，是button，不是debounce的this
    }, wait)

    // 立即执行
    now ? func.call(this, ...params) : null;
  }

}


function handle () {
  // 设置定时器
  setTimeout(()=>{
    console.log('OK')
  }, 1000)
}

// 点击一次，触发执行一次，频繁执行函数
// submit.onclick = handle;  

submit.onclick = debounce(handle, 500, true)
