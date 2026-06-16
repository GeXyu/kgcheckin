import { daily_claim } from "./utils/tianfu_api.js";
import DingTalkNotifier from "./utils/dingtalk.js";

async function tianfu() {
    const auth_token = process.env.TIANFU_TOKEN
    // 获取钉钉webhook地址和密钥（从环境变量中获取）
    const dingtalkWebhook = process.env.DINGTALK_WEBHOOK
    const dingtalkSecret = process.env.DINGTALK_SECRET

    // 创建钉钉通知实例（仅在配置了webhook时创建）
    const dingtalkNotifier = dingtalkWebhook ? new DingTalkNotifier(dingtalkWebhook, dingtalkSecret) : null;

    // 签到
    const res = await daily_claim(auth_token)
    
    //
    if (res.code === 200) {
        console.log("签到成功")
    }else { 
        console.log("签到成功")
        if (dingtalkNotifier) {
            try {
            await dingtalkNotifier.sendWithTitle(
                "注意!",
                "tianfu登陆失败!"
            );
            } catch (notifyError) {
            console.error("钉钉通知发送失败:", notifyError);
            }
        }
    }
}

tianfu()