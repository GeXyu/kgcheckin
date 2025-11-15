import { check_in } from "./utils/enshan_api.js";
import { delay } from "./utils/utils.js";
import DingTalkNotifier from "./utils/dingtalk.js";
async function passnat() {
    const cookie = process.env.ENSHAN_COOKIE

    // 获取钉钉webhook地址和密钥（从环境变量中获取）
    const dingtalkWebhook = process.env.DINGTALK_WEBHOOK
    const dingtalkSecret = process.env.DINGTALK_SECRET
    // 创建钉钉通知实例（仅在配置了webhook时创建）
    const dingtalkNotifier = dingtalkWebhook ? new DingTalkNotifier(dingtalkWebhook, dingtalkSecret) : null;



    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
        'Connection' : 'keep-alive',
        'Host' : 'www.right.com.cn',
        'Upgrade-Insecure-Requests' : '1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language' : 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Accept-Encoding' : 'gzip, deflate, br',
        'Cookie': cookie
    }

    // 先登录

    let res = await check_in(headers)
    console.log(res)
    // // 如果登录成功，执行签到
    // if (res.code === 10000) {
    //     console.log("登录成功")
    //     await delay(5 * 1000)
    //     const auth_token = res.data.auth_token
    //     // 设置token到环境变量或请求头中
    //     const checkin = await get("/user/checkIn", { "authorization": 'Bearer ' + auth_token})
    //     console.log(checkin)

    // }else { 
    //     console.log("登录失败")
    //     if (dingtalkNotifier) {
    //         try {
    //         await dingtalkNotifier.sendWithTitle(
    //             "注意!",
    //             "passnat登陆失败!"
    //         );
    //         } catch (notifyError) {
    //         console.error("钉钉通知发送失败:", notifyError);
    //         }
    //     }
    // }
}

passnat()