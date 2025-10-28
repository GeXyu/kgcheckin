
// 发送请求
async function get(path,headers) {
  const result = await fetch("https://api.passnat.com" + path, {
    method: "GET",
    headers: headers
  }).then(r => r.json())
  // console.log(result)
  return result
}


async function post(path,body) {
  const result = await fetch("https://api.passnat.com" + path, {
    method: "POST",
    body: body
  }).then(r => r.json())
  console.log("post body:%s",body)
  return result
}

export { get, post }
