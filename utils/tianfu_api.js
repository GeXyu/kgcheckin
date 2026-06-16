

async function daily_claim(token) {
  const result = await fetch("https://api.tianfuagent.com/user/api/v1/user/user/credits/daily-claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    },

  }).then(r => r.json())
  return result
}

export { daily_claim }
