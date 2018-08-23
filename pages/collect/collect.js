//index.js
//获取应用实例
import {request} from '../../api'
const anonymityList = [
  '张三丰', '周芷若', '张无忌', '鲁智深', '二狗子', '孙悟空', '猪八戒', '亚瑟', '李白', '妲己'
]
var app = getApp()
Page({
  data: {
    content: '',
    categoryId: null,
    categoryIndex: 0,
    anonymityName: anonymityList[Math.floor(Math.random(0, 1) * anonymityList.length)]
  },
  onLoad: function (options) {
    var _this = this
    const {type} = options
    if (type === 'community') {
      return request({
        url: '/category_list',
        success: function (res) {
          _this.setData({categoryList: res.data.categoryList, type})
        }
      })  
    }
    return this.setData({type})
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
    const {content, categoryId, type} = this.data
    if (!content) {
      return wx.showToast({title: '请填写帖子内容', icon: 'none'})
    }
    if (type=== 'community' && !categoryId) {
      return wx.showToast({title: '请选择帖子类别', icon: 'none'})
    }
    const data = {
      content,
      type,
      category_id: this.data.categoryId,
      openid: wx.getStorageSync('openid')
    }
    if (type === 'anonymity') {
      data.anonymity = this.data.anonymityName
    }
    request({
      url: '/publish_post',
      data,
      method: 'post',
      success: function (res) {
        if (type === 'community') {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        if (type === 'nearby') {
          wx.switchTab({
            url: '/pages/discover/index'
          })
        }
        if (type === 'anonymity') {
          console.log('????')
          wx.navigateTo({
            url: '/pages/discover/index?activePage=anonymity'
          });
        }
      }
    })
  },
  chooseImage () {
    wx.chooseImage({
      success: res => {
        console.log(res)
      }
    })
  },
  changeAnonymityName () {
    const name = this.data.anonymityName
    const index = anonymityList.indexOf(name)
    anonymityList.slice(index)
    this.setData({anonymityName: anonymityList[Math.floor(Math.random(0, 1) * anonymityList.length)]}) 
  }
})
