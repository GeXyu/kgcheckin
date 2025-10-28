import { post, get } from "./utils/passnat_api.js";

async function passnat() {
    const phone = process.env.PASSNAT_PHONE
    const password = process.env.PASSNAT_PASSWORD

    // 先登录
    const res = await post("/public/login", { "password": password, "phone_number": phone, "platform": 1 })

    
    // // 如果登录成功，执行签到
    if (res.code === 10000) {
        console.log("登录成功")
        const auth_token = res.data.auth_token
        // 设置token到环境变量或请求头中
        const checkin = await get("/user/checkIn", { "authorization": 'Bearer ' + auth_token})
        console.log(checkin)
    }else { 
        console.log("登录失败")
    }
}

passnat()