// 发送 GET 请求
async function get(url, headers) {
  const result = await fetch(url, {
    method: "GET",
    headers: headers
  }).then(r => r.json())
  return result
}

// 发送 POST 请求
async function post(url, headers) {
  const result = await fetch(url, {
    method: "POST",
    headers: headers
  }).then(r => r.json())
  return result
}

export { get, post }
