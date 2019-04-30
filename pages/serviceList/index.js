const app = getApp()
import {asyncRequest} from '../../api'
import { async } from '../../utils/runtime';
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    shopkeepers: [],
    loading: true,
    page: 0,
    pageSize: 4,
    serviceId: '',
    hasNextPage: true
  },
  onLoad: async function (options) {
    const _this = this
    const {page, pageSize} = this.data
    wx.showLoading({title: '加载中'})
    const {shopkeepers} = await asyncRequest({
      url: `/merchantService/${options.serviceId}/shopkeepers`,
      data: {page, pageSize}
    })
    wx.hideLoading()
    shopkeepers.forEach(shopkeeper => {
      shopkeeper.tabs = shopkeeper.tabs.split(',')
    })
    this.setData({shopkeepers, serviceId: options.serviceId, hasNextPage: shopkeepers.length === pageSize})
  },
  onReachBottom: async function () {
    let {page, pageSize, shopkeepers, serviceId, hasNextPage} = this.data
    if (hasNextPage) {
      page += 1
      wx.showLoading({title: '加载中'})
      const data = await asyncRequest({
        url: `/merchantService/${serviceId}/shopkeepers`,
        data: {page, pageSize}
      })
      wx.hideLoading()
      data.shopkeepers.forEach(shopkeeper => {
        shopkeeper.tabs = shopkeeper.tabs.split(',')
      })
      
      this.setData({shopkeepers: shopkeepers.concat(data.shopkeepers), page, hasNextPage: data.shopkeepers.length === pageSize})  
    }
  },
  call: function (e) {
    const phoneNumber = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  toggleLike: async function (e) {
    const shopkeeperId = e.currentTarget.dataset.shopkeeperId
    try {
      await asyncRequest({
        url: `/merchantService/shopkeeper/${shopkeeperId}/like`,
        method: 'post'
      })
      const shopkeepers = [...this.data.shopkeepers]
      const idx = shopkeepers.findIndex(shopkeeper => shopkeeper.id === shopkeeperId)
      shopkeepers[idx] = {
        ...shopkeepers[idx],
        isLike: !shopkeepers[idx].isLike,
        like_count: shopkeepers[idx].isLike ? shopkeepers[idx].like_count - 1 : shopkeepers[idx].like_count + 1
      }
      this.setData({shopkeepers})
    } catch (err) {
      wx.showToast({
        title: '点赞失败',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
    }
  }
})