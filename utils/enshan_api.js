
// 发送请求
async function check_in(headers) {
  const result = await fetch("https://www.right.com.cn/forum/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog", {
    method: "GET",
    headers: headers
  }).then(r => r.text)
  // console.log(result)
  return result
}



export { check_in }
