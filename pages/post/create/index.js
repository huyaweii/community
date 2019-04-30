//index.js
//获取应用实例
import {asyncRequest} from '../../../api'
import {request} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')
const qiniuUploader = require("../../../utils/qiniuUploader")
const tabList = [
  {name: '招聘'}, 
  {name: '租房'}, 
  {name: '二手物品'}, 
  {name: '相亲'},
  {name: '其他'}
]
var app = getApp()
Page({
  data: {
    content: '',
    tabIndex: 0,
    images: [],
    tabList
  },
  onLoad: function (options) {
  },

  changeContent (e) {
    this.setData({content: e.detail.value})
  },
  changeTab (e) {
    const tabIndex = e.detail.value
    this.setData({tabIndex})
  },
  async publishPost () {
    const {content, categoryId, tabList, tabIndex, images} = this.data
    if (!content) {
      return wx.showToast({title: '请填写帖子内容', icon: 'none'})
    }
    const data = {
      content,
      images,
      tab: tabList[tabIndex].name
    }
    const res = await asyncRequest({
      url: '/post/create',
      data,
      method: 'post'
    })
    wx.switchTab({
      url: '/pages/post/index'
    })
  },
  chooseImage () {
    wx.chooseImage({
      success: res => {
        console.log(res)
      }
    })
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
                images.push(`http://www.qiniu.cmty.xyz/${res.key}`)
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