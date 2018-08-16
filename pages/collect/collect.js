//index.js
//获取应用实例
import {request} from '../../api'
var app = getApp()
Page({
  data: {
    content: '',
    categoryId: null,
    categoryIndex: 0
  },
  onLoad: function () {
    var _this = this
    request({
      url: '/category_list',
      success: function (res) {
        _this.setData({categoryList: res.data.categoryList})
      }
    })
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  changeContent (e) {
    this.setData({content: e.detail.value})
  },
  changeCategory (e) {
    const val = e.detail.value
    this.setData({categoryId: this.data.categoryList[val].id, categoryIndex: val})
  },
  publishPost () {
    const {content} = this.data
    if (!content) {

    }
    request({
      url: '/publish_post',
      data: {
          content,
          category_id: this.data.categoryId,
          openid: wx.getStorageSync('openid')
      },
      method: 'post',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    })
  }
})
