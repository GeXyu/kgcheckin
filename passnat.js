import { post, get } from "./utils/passnat_api.js";
import DingTalkNotifier from "./utils/dingtalk.js";
async function passnat() {
    const phone = process.env.PASSNAT_PHONE
    const password = process.env.PASSNAT_PASSWORD
    // 获取钉钉webhook地址和密钥（从环境变量中获取）
    const dingtalkWebhook = process.env.DINGTALK_WEBHOOK
    const dingtalkSecret = process.env.DINGTALK_SECRET

    // 创建钉钉通知实例（仅在配置了webhook时创建）
    const dingtalkNotifier = dingtalkWebhook ? new DingTalkNotifier(dingtalkWebhook, dingtalkSecret) : null;

    // 先登录
    const res = await post("/public/login", { "password": password, "phone_number": phone, "platform": 1 })

    
    // // 如果登录成功，执行签到
    if (res.code === 10000) {
        console.log("登录成功")
        await delay(10 * 1000)
        const auth_token = res.data.auth_token
        // 设置token到环境变量或请求头中
        const checkin = await get("/user/checkIn", { "authorization": 'Bearer ' + auth_token})
        console.log(checkin)

    }else { 
        console.log("登录失败")
        if (dingtalkNotifier) {
            try {
            await dingtalkNotifier.sendWithTitle(
                "注意!",
                "passnat登陆失败!"
            );
            } catch (notifyError) {
            console.error("钉钉通知发送失败:", notifyError);
            }
        }
    }
}

passnat()