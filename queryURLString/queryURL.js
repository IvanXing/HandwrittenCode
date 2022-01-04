// 实现解析 URL 查询参数的函数

// let url = 'http://www.domain.com/?user=rose&id=123&id=456&city=北京&enabled'
let url = 'http://www.domain.com/?user=rose&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled'

console.log(parseParam(url))

// // 结果
// {
//   url: 'rose',
//   id: [123, 456],  // 重复出现的 key 要组装成数组，能被转成数字的，就转成数字
//   city: '北京', // 中文需要解码
//   enable: true,  // 未指定 key 的约定为true
// }

function parseParam(url){
  // 1. 获取 ？后的字符串信息
  // 得到 user=rose&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled
  const [ , search] = url.split('?');   // url.split('?')[1] 也可

  // 2. 通过 & 切割字符串，得到数组
  // 得到  ['user=rose', 'id=123', 'id=456', 'city=%E5%8C%97%E4%BA%AC', 'enabled']
  const array = search.split('&');

  // 3. 处理数组
  return array.reduce((accu, str)=>{

    if (str.includes('=')) {

      let [key, value] = str.split('=');

      // 解码，会返回一个字符串
      value = decodeURIComponent(value)
      // value中是否全为数字，是的话转为数字，否则为本身
      //  ^ 开头，$ 结尾，严格匹配 \d+
      value = /^\d+$/.test(value) ? +value : value

      // 如果key已经出现过，value 存入数组，否则存入对象
      if (accu.hasOwnProperty(key)) {
        accu[key] = [].concat(accu[key], value)
      } else {
        accu[key] = value
      }

    } else {
      // str 中不包含等号，直接赋值为 true
      accu[str] = true;
    }

    return accu

  }, {})

  // 4. 返回对象
}
