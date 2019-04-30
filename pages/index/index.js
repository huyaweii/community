const app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    recommendServices: [],
    convenienceServices: []
  },
  onLoad: async function (options) {
    const _this = this
    const {recommendServices, convenienceServices} = await asyncRequest({
      url: '/merchantService',
    })
  
    this.setData({recommendServices, convenienceServices})
  }  
})