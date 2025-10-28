import { post, get } from "./utils/passnat_api.js";

async function passnat() {
    const phone = process.env.PASSNAT_PHONE
    const password = process.env.PASSNAT_PASSWORD
    console.log("phone:%s password:%s", phone, password)

    // 先登录
    const res = await post("/public/login", { "password": password, "phone_number": phone, "platform": 1 })
    console.log(res)
    
    // // 如果登录成功，执行签到
    // if (res.code === 0) {
    //     const token = res.data.token
    //     // 设置token到环境变量或请求头中
    //     const checkin = await post("/user/checkIn", { "token": token })
    //     console.log(checkin)
    // }
}

passnat()