import { get, post } from "./utils/cg163_api.js";
import DingTalkNotifier from "./utils/dingtalk.js";

async function cg163() {
    // 从环境变量获取 cookies（多个账号用 # 分隔）
    const cookies = process.env.WYYCG_COOKIES ? process.env.WYYCG_COOKIES.split('#') : [];
    
    // 获取钉钉webhook地址和密钥（从环境变量中获取）
    const dingtalkWebhook = process.env.DINGTALK_WEBHOOK;
    const dingtalkSecret = process.env.DINGTALK_SECRET;

    // 创建钉钉通知实例（仅在配置了webhook时创建）
    const dingtalkNotifier = dingtalkWebhook ? new DingTalkNotifier(dingtalkWebhook, dingtalkSecret) : null;

    // 接口地址
    const SIGN_URL = 'https://n.cg.163.com/api/v2/sign-today';
    const CURRENT_URL = 'https://n.cg.163.com/api/v2/client-settings/@current';

    // 检查是否有配置 cookies
    if (!cookies || cookies.length === 0) {
        console.log('[网易云游戏自动签到]未设置cookie，正在退出……');
        if (dingtalkNotifier) {
            try {
                await dingtalkNotifier.sendWithTitle(
                    "注意!",
                    "网易云游戏自动签到失败：未设置cookie！"
                );
            } catch (notifyError) {
                console.error("钉钉通知发送失败:", notifyError);
            }
        }
        process.exit(1);
    }

    console.log(`检测到${cookies.length}个账号，即将开始签到！`);
    
    const success = [];
    const failure = [];
    const msg = [];

    // 遍历所有账号进行签到
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const accountIndex = i + 1;
        let authError = false;
        let signError = false;
        let signReturn = null;
        let me = null;

        // 先验证账号
        try {
            const headers = {
                'Host': 'n.cg.163.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'X-Platform': '0',
                'Authorization': String(cookie),
                'Origin': 'https://cg.163.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://cg.163.com/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja-JP;q=0.6,ja;q=0.5'
            };
            
            me = await get(CURRENT_URL, headers);
        } catch (error) {
            const message = `第${accountIndex}个账号验证失败！请检查Cookie是否过期！`;
            failure.push(cookie);
            msg.push(message);
            authError = true;
            console.log(message);
        }

        // 如果验证成功，执行签到
        if (me) {
            if (me.status_code && me.status_code !== 200 && !authError) {
                const message = `第${accountIndex}个账号验证失败！请检查Cookie是否过期！`;
                failure.push(cookie);
                msg.push(message);
                console.log(message);
            } else {
                try {
                    const headers = {
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja-JP;q=0.6,ja;q=0.5',
                        'Authorization': String(cookie),
                        'Connection': 'keep-alive',
                        'Content-Length': '0',
                        'Host': 'n.cg.163.com',
                        'Origin': 'https://cg.163.com',
                        'Referer': 'https://cg.163.com/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-site',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                        'X-Platform': '0'
                    };

                    signReturn = await post(SIGN_URL, headers);
                } catch (error) {
                    const message = `第${accountIndex}个账号签到失败，网络请求异常！`;
                    failure.push(cookie);
                    msg.push(message);
                    signError = true;
                    console.log(message);
                }

                if (signReturn && signReturn.status_code === 200) {
                    const message = `第${accountIndex}个账号签到成功！`;
                    success.push(cookie);
                    msg.push(message);
                    console.log(message);
                } else if (!signError && signReturn) {
                    const message = `第${accountIndex}个账号签到失败，状态码：${signReturn.status_code}，响应：${JSON.stringify(signReturn)}`;
                    failure.push(cookie);
                    msg.push(message);
                    console.log(message);
                }
            }
        }
    }

    // 生成汇总消息
    const outputmsg = msg.join('<br>');
    const teleinfomsg = `
感谢使用来自GamerNoTitle的网易云游戏自动签到脚本！
今日签到结果如下：
成功数量：${success.length}/${cookies.length}
失败数量：${failure.length}/${cookies.length}
具体情况如下：
${outputmsg}
GamerNoTitle: https://bili33.top
网易云游戏自动签到脚本: https://github.com/GamerNoTitle/wyycg-autocheckin
    `;
    
    console.log(teleinfomsg);

    // 如果配置了钉钉通知，发送结果
    if (dingtalkNotifier) {
        try {
            const summary = `
网易云游戏自动签到报告
====================
✅ 成功：${success.length}/${cookies.length}
❌ 失败：${failure.length}/${cookies.length}
详细情况：
${msg.join('\n')}
            `.trim();
            
            if (failure.length > 0) {
                await dingtalkNotifier.sendWithTitle("网易云游戏签到有失败！", summary);
            } else {
                await dingtalkNotifier.sendWithTitle("网易云游戏签到成功！", summary);
            }
        } catch (notifyError) {
            console.error("钉钉通知发送失败:", notifyError);
        }
    }
    
    // 如果有失败的账号，退出码为1
    if (failure.length > 0) {
        process.exit(1);
    }
}

// 执行主函数
cg163().catch(error => {
    console.error('[网易云游戏自动签到]脚本运行错误，具体请参见日志！');
    console.error(error);
    process.exit(1);
});
