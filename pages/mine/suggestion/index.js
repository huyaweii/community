import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')

var app = getApp()
Page({
  data: {
    value: ''
  },
  onLoad: function () {
    this.setData({userInfo: app.globalData.userInfo})
  },
  submit: async function () {  
    if (!this.data.value) {
      return wx.showToast({
        title: '输入框不能为空',
        icon: 'none',
      })
    }
    try {
      await asyncRequest({url: '/suggestion', data: {content: this.data.value}, method: 'post'})
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      })
      this.setData({value: ''})
    } catch(err) {
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    }
    
  },
  change: function (e) {
    this.setData({value: e.detail.value})
  }
})
