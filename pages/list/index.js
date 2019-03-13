const app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    shopkeepers: [],
  },
  onLoad: async function (options) {
    const _this = this
    const {shopkeepers} = await asyncRequest({
      url: `/merchantService/${options.serviceId}/shopkeepers`,
    })
    this.setData({shopkeepers})
  }
})