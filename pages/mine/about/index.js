var app = getApp()
Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    this.setData({userInfo: app.globalData.userInfo})
  },
  getUserInfo: function (result) {
    const userInfo = result.detail.userInfo
    if (userInfo) {
      console.log(userInfo)
      app.globalData.userInfo = userInfo
      this.setData({userInfo})
    }
  }
})
