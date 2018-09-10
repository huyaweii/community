var app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

const servicesIcon = {
  '房屋装修': 'repair',
  '家电维修': 'decoration',
  '手机专卖': 'mobile',
  '宽带安装': 'broadband'
}
Page({
  data: {
    services: [],
    servicesIcon
  },
  onLoad: async function (options) {
    const _this = this
    const {services} = await asyncRequest({
      url: '/merchantService',
    })
    let tempServices = []
    for(let i=0,len = services.length; i<len; i+=3){
      tempServices.push(services.slice(i,i+3));
    }
    console.log(tempServices)
    this.setData({services: tempServices})
  }  
})
