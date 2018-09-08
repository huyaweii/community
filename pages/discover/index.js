var app = getApp()
Page({
  data: {
    userInfo: null
  },
  onShow:function(e){
    this.onLoad();
  },
  onLoad: function () {
    this.setData({userInfo: app.globalData.userInfo})
  },
  getUserInfo: function (result) {
    const userInfo = result.detail.userInfo
    if (userInfo) {
      app.globalData.userInfo = userInfo
      this.setData({userInfo})
    }
  }
})
