const app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    shopkeepers: [],
    isOpen: false,
    page: 0,
    pageSize: 4,
    hasNextPage: true
  },
  onShow:function(e){
    this.onLoad();
  },
  onLoad: async function (options) {
    const {pageSize} = this.data
    const {shopkeepers} = await asyncRequest({
      url: '/shopkeeper/myself/like',
      data: {page: 0, pageSize}
    })
    shopkeepers.forEach(shopkeeper => {
      shopkeeper.tabs = shopkeeper.tabs.split(',')
    });
    const {shopkeeper} = await asyncRequest({
      url: '/shopkeeper/myself'
    })
    let isOpen = false
    if (shopkeeper && shopkeeper.isOpen) {
      isOpen = true
    }
    this.setData({shopkeepers, isOpen, page: 0, hasNextPage: shopkeepers.length === pageSize})
  },
  onReachBottom: async function () {
    let {page, pageSize, shopkeepers, hasNextPage} = this.data
    if (hasNextPage) {
      page += 1
      wx.showLoading({title: '加载中'})
      const data = await asyncRequest({
        url: '/shopkeeper/myself/like',
        data: {page, pageSize}
      })
      wx.hideLoading()
      data.shopkeepers.forEach(shopkeeper => {
        shopkeeper.tabs = shopkeeper.tabs.split(',')
      })
      
      this.setData({shopkeepers: shopkeepers.concat(data.shopkeepers), page, hasNextPage: data.shopkeepers.length === pageSize})  
    }
  },
})