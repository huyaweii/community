const app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')
Page({
  data: {
    isSubmited: false,
    name: '',
    telephone: ''
  },
  onLoad: async function (options) {
    const shopkeeper = await asyncRequest({
      url: '/shopkeeper/myself',
    })
    this.setData({isSubmited: Boolean(shopkeeper)})
  },
  changeName: function (e) {
    this.setData({name: e.detail.value})
  },
  changeTel: function (e) {
    this.setData({telephone: e.detail.value})
  },
  submit: async function () {
    const {name, telephone} = this.data
    if (name.length > 6 || name === '') {
      wx.showToast({
        title: '请输入正确的姓名',
        icon: 'none',
        duration: 1500,
        mask: false,
      }); 
      return false; 
    }
    if(!(/^1[34578]\d{9}$/.test(telephone))){ 
      wx.showToast({
        title: '手机格式不正确',
        icon: 'none',
        duration: 1500,
        mask: false,
      }); 
      return false; 
    }
    try {
      const shopkeeper = await asyncRequest({
        url: '/shopkeeper/create',
        method: 'post',
        data: {
          keeper_name: name,
          telephone
        }
      })
      this.setData({isSubmited: true})
    } catch (err) {
      wx.showToast({
        title: '申请失败',
        icon: 'none',
        duration: 1500,
        mask: false,
      }); 
    }
  } 
})