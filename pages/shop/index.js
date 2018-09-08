var app = getApp()
import {request} from '../../api'
const servicesIcon = {
  '房屋装修': 'repair',
  '家电维修': 'decoration',
  '手机专卖': 'mobile'
}
Page({
  data: {
    services: [],
    servicesIcon
  },
  onLoad: function (options) {
    const _this = this
    request({
      url: '/merchantService',
      data: {
      },
      success: function (res) {
        console.log(res.data.services)
       _this.setData({services: res.data.services})
      }
    })
  }  
})
