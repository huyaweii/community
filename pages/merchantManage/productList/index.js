const app = getApp()
import {asyncRequest} from '../../../api'
import { async } from '../../../utils/runtime';
const regeneratorRuntime = require('../../../utils/runtime.js')

Page({
  data: {
    products: []
  },
  onLoad: async function (options) {
    try {
      const {products} = await asyncRequest({
        url: '/product/myself/list'
      })
      this.setData({products})  
    } catch (err) {
      wx.showToast({
        title: '请求失败',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  },
  delete: async function (e) {
    const _this = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      content: '确定删除该产品吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#fd790d',
      success: async res => {
        if(res.confirm){
          try {
            await asyncRequest({
              url: `/product/${id}`,
              method: 'delete'
            })
            const products = [...this.data.products]
            const idx = products.findIndex(product => product.id === id)
            products.splice(idx, 1)
            _this.setData({products})
          } catch (err) {
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 1500,
              mask: false,
            });
          }
        }
      }
    })
    
  }
})