import crypto from 'crypto';

/**
 * 钉钉通知类
 * 用于发送钉钉机器人消息
 */
class DingTalkNotifier {
  /**
   * 构造函数
   * @param {string} webhookUrl - 钉钉机器人的webhook地址
   * @param {string} secret - 钉钉机器人的加签密钥
   */
  constructor(webhookUrl, secret) {
    this.webhookUrl = webhookUrl;
    this.secret = secret;
  }

  /**
   * 生成签名（Node.js环境兼容版本）
   * @param {number} timestamp - 时间戳
   * @returns {string} 签名
   */
  generateSign(timestamp) {
    if (!this.secret) {
      return '';
    }

    const stringToSign = timestamp + '\n' + this.secret;
    const sign = crypto.createHmac('sha256', this.secret)
      .update(stringToSign, 'utf8')
      .digest('base64');
    return encodeURIComponent(sign);
  }

  /**
   * 发送文本消息
   * @param {string} content - 消息内容
   * @returns {Promise<Object>} 响应结果
   */
  async sendText(content) {
    if (!this.webhookUrl) {
      console.warn('钉钉webhook地址未配置，跳过消息发送');
      return;
    }

    const timestamp = Date.now();
    let url = this.webhookUrl + '&timestamp=' + timestamp;
    
    // 如果配置了密钥，则添加签名
    if (this.secret) {
      const sign = this.generateSign(timestamp);
      if (sign) {
        url += '&sign=' + sign;
      }
    }

    const message = {
      msgtype: 'text',
      text: {
        content: content
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('钉钉消息发送失败:', error);
      throw new Error('钉钉消息发送失败: ' + error.message);
    }
  }

  /**
   * 发送带标题和内容的消息
   * @param {string} title - 标题
   * @param {string} content - 内容
   * @returns {Promise<Object>} 响应结果
   */
  async sendWithTitle(title, content) {
    const fullContent = `${title}\n\n${content}`;
    return await this.sendText(fullContent);
  }
}

export default DingTalkNotifier;