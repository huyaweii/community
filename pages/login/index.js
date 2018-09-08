var app = getApp()
import {request} from '../../api'

Page({
  data: {
    userInfo: null,
    url: ''
  },
  onLoad: function (options) {
    const {url} = options
    this.setData({userInfo: app.globalData.userInfo, url})
  },
  getUserInfo: function (result) {
    const _this = this
    const userInfo = result.detail.userInfo
    console.log(result)
    if (userInfo) {
      app.globalData.userInfo = userInfo
      const {avatarUrl, nickName, gender} = userInfo
      request({
        url: '/sync_userInfo',
        data: {
          avatar: avatarUrl,
          name: nickName, 
          gender,
          encryptedData: result.detail.encryptedData,
          iv: result.detail.iv
        },
        success: function (res) {
          const {url} = _this.data
          console.log(url, 'ti')
          wx.switchTab({
            url
          })
        }
      })
    }
  }
})
