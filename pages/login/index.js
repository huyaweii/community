var app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    userInfo: null,
    url: ''
  },
  onLoad: function (options) {
    const {url} = options
    this.setData({userInfo: app.globalData.userInfo, url})
  },
  getUserInfo: async function (result) {
    const _this = this
    const userInfo = result.detail.userInfo
    if (userInfo) {
      app.globalData.userInfo = userInfo
      const {nickName, avatarUrl} = userInfo
      await asyncRequest({
        url: '/user/create',
        method: 'post',
        data: {
          nickName,
          avatarUrl
        }
      })
      wx.redirectTo({
        url: decodeURIComponent(this.data.url)
      })
    }
  }
})