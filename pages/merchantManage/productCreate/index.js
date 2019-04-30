const app = getApp()
const qiniuUploader = require("../../../utils/qiniuUploader")
const regeneratorRuntime = require('../../../utils/runtime.js')
import {asyncRequest} from '../../../api'
import { async } from '../../../utils/runtime';

Page({
  data: {
    name: '',
    price: '',
    desc: '',
    pic: '',
    productId: ''
  },
  onLoad: async function (options) {
    const productId = options.productId
    if (productId) {
      const {product} = await asyncRequest({
        url: `/product/${productId}`
      })
      const {name, price, desc, pic} = product
      this.setData({productId, name, price, desc, pic})
    } 
  },
  onChange: function (e) {
    const name = e.currentTarget.dataset.name
    this.setData({[name]: e.detail.value})
  },
  choosePic: async function () {
    const _this = this
    // 选择图片
    wx.chooseImage({
      count: 4,
      success: async function (res) {
        const filePaths = res.tempFilePaths;
        // 交给七牛上传
        res = await asyncRequest({
          url: '/uploadToken'
        })
        const qiniuUploadToken = res.uploadToken
        filePaths.forEach(filePath => {
          qiniuUploader.upload(filePath, (res) => {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            _this.setData({
              pic: `http://www.qiniu.cmty.xyz/${res.key}`
            });
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
  },
  submit: async function () {
    const {name, price, desc, pic, productId} = this.data
    if (name === '') {
      return wx.showToast({
        title: '名称不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
    if (price === '') {
      return wx.showToast({
        title: '价格不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
    if (desc.length > 20) {
      return wx.showToast({
        title: '描述过长',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
    if (pic === '') {
      return wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    } 
    if (productId) {
      try {
        await asyncRequest({
          url: `/product/${productId}`,
          method: 'put',
          data: {
            name,
            price,
            desc,
            pic
          }
        })
        wx.navigateTo({url: '/pages/merchantManage/productList/index'})
      } catch (err) {
        wx.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }

    } else {
      try {
        await asyncRequest({
          url: '/product/create',
          method: 'post',
          data: this.data
        })
        wx.redirectTo({url: '/pages/merchantManage/productList/index'})
      } catch (err) {
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    }
    
    
  }
})