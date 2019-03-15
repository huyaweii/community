var app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    services: []
  },
  onLoad: async function (options) {
    const _this = this
    const {services} = await asyncRequest({
      url: '/merchantService',
    })
  
    this.setData({services})
  }  
})