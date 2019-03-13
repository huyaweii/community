var app = getApp()
import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

const servicesIcon = {
  '房屋装修': 'repair',
  '家电维修': 'decoration',
  '开锁换锁': 'lock',
  '宽带安装': 'broadband',
  '成人保健': 'sex'
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
  
    this.setData({services})
  }  
})