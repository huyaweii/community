const app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    shopkeepers: [],
    loading: true
  },
  onLoad: async function (options) {
    const _this = this
    const {shopkeepers} = await asyncRequest({
      url: `/merchantService/${options.serviceId}/shopkeepers`,
    })
    shopkeepers.forEach(shopkeeper => {
      shopkeeper.tabs = shopkeeper.tabs.split(',')
    });
    this.setData({shopkeepers, loading: false})
  },
  call: function (e) {
    const phoneNumber = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  }
})