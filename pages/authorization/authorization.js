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
  getUser (e) {
    if (e.detail.iv) {
      app.getUserInfo()
    }
  }
})
