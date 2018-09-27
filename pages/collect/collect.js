//index.js
//获取应用实例
import {request} from '../../api'
const qiniuUploader = require("../../utils/qiniuUploader")
import {anonymityList} from '../../config/index.js'

var app = getApp()
Page({
  
  data: {
    content: '',
    categoryId: null,
    categoryIndex: 0,
    anonymityName: anonymityList[Math.floor(Math.random(0, 1) * anonymityList.length)],
    images: [],
    loading: false
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
    const {content, categoryId, type, images} = this.data
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
      images
    }
    if (type === 'anonymity') {
      data.anonymity = this.data.anonymityName
    }
    this.setData({loading: true})
    const _this = this
    request({
      url: '/post/create',
      data,
      method: 'post',
      success: function (res) {
        _this.setData({loading: false})

        if (type === 'community') {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        if (type === 'nearby') {
          app.globalData.dynamicActivePage = 'nearby'
          wx.switchTab({
            url: '/pages/dynamic/index'
          })
        }
        if (type === 'anonymity') {
          app.globalData.dynamicActivePage = 'anonymity'
          wx.switchTab({
            url: '../dynamic/index?activePage=anonymity'
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
  },
  didPressChooseImage: function() {
    const _this = this;
    if (this.data.images.length >= 4) {
      return wx.showToast({title: '最多只能发布四张图片', icon: 'none'})
    }
    // 选择图片
    wx.chooseImage({
      count: 4,
      success: function (res) {
        const filePaths = res.tempFilePaths;
        // 交给七牛上传
        request({
          url: '/uploadToken',
          success: res => {
            const qiniuUploadToken = res.data.uploadToken
            filePaths.forEach(filePath => {
              wx.showLoading({title: '上传中'})
              qiniuUploader.upload(filePath, (res) => {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                const images = [..._this.data.images]
                images.push(`http://ojs08uydv.bkt.clouddn.com/${res.key}`)
                _this.setData({
                  images
                });
                wx.hideLoading()
              }, (error) => {
            console.log('error: ' + error);
              }, {
                region: 'NCN',
                // domain: 'bzkdlkaf.bkt.clouddn.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                uptoken: qiniuUploadToken, // 由其他程序生成七牛 uptoken
              }, (res) => {
                  console.log('上传进度', res.progress)
                  console.log('已经上传的数据长度', res.totalBytesSent)
                  console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
              })
            })
          }
        })
      }
    })
  }
})
