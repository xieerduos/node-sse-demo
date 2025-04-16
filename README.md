# node sse demo

微信小程序 Server-sent events（SSE） demo

https://docs.ffffee.com/wechat/微信小程序/微信小程序sse-demo.html

## quick start

1. node 版本

```
node -v
v20.18.1
```

2. 安装模块

```
npm install
```

3. 启动服务

```
node server.js
```

4. 浏览器访问

http://localhost:3000

## 微信小程序端代码

```js
// pages/me/files-view/files-view.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
  },

  getServerEvents() {
    const _this = this;
    const requestTask = wx.request({
      url: "http://localhost:3000/events",
      method: "GET",
      enableChunked: true, // 必须启用分块传输
      responseType: "text",
      success(res) {
        console.log("请求成功", JSON.stringify(res));
      },
      fail(err) {
        console.error("请求失败", err);
      },
    });
    requestTask.onChunkReceived((res) => {
      const chunk = new TextDecoder().decode(res.data);
      // console.log(chunk);

      // 可能同时收到多个事件，按事件流格式解析
      const events = _this.parseSSE(chunk);
      events.forEach((event) => {
        console.log("收到事件：", event);
        _this.setData({
          messages: [
            ..._this.data.messages,
            {
              ...event,
              data:
                typeof event.data === "object" && event.data
                  ? JSON.stringify(event.data)
                  : event.data,
            },
          ],
        });
      });
    });

    requestTask.onHeadersReceived((res) => {
      // 可选：处理响应头
    });
  },

  parseSSE(chunk) {
    const eventBlocks = chunk.split("\n\n").filter(Boolean);
    return eventBlocks.map((block) => {
      const lines = block.split("\n");
      let event = "";
      let data = "";
      lines.forEach((line) => {
        if (line.startsWith("event:")) {
          event = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          data += line.slice(5).trim();
        }
      });
      try {
        data = JSON.parse(data);
        data = data;
      } catch (err) {
        // data不是json格式时保持原样
      }
      return { event, data };
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("1111");
    this.getServerEvents();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
```

```xml
<!--pages/me/files-view/files-view.wxml-->
<view class="container">
  <block wx:for="{{messages}}" wx:key="index">
    <view class="message">
      <text class="event">{{item.event}}: </text>
      <text class="data">{{item.data}}</text>
    </view>
  </block>
</view>
```

注意：

小程序在开发阶段请求本地服务器，需在小程序开发工具中勾选：

```
开发工具 > 详情 > 本地设置 > 勾选“不校验合法域名”
```
