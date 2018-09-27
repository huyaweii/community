import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')

var app = getApp()
Page({
  data: {
    shopName: '',
    keeperName: '',
    telephone: '',
    address: '',
    services: [],
    selectedService: {},
    shopkeeper: null,
    showForm: true,
    loading: true
  },
  onLoad: async function (options) {
    app.isAuthed('/pages/shop/application/index')
    const _this = this
    const {services} = await asyncRequest({url: '/merchantService'})
    const {shopkeeper} = await asyncRequest({url: '/merchantService/shopkeeper/mine'})
    if (shopkeeper.length > 0) {
      const {shop_name, keeper_name, telephone, address, service_id} = shopkeeper[0]
      const selectedService = services.find(service => service.id === service_id)
      this.setData({services, showForm: false, shopkeeper: shopkeeper[0], shopName: shop_name, keeperName: keeper_name, telephone, address, selectedService, loading: false})
    } else {
      this.setData({services, loading: false})
    }
  },
  change: function(e) {
    const {name} = e.currentTarget.dataset
    const value = e.detail.value
    // if (name === 'shopName') {
    //   if (value.length > 20) {
    //     wx.showToast({
    //       title: '名称过长',
    //       icon: 'none'
    //     })
    //     return this.setData({shopName: this.data.shopName})
    //   }
    // }
    // if (name === 'keeperName') {
    //   if (value.length > 8) {
    //     wx.showToast({
    //       title: '名称过长',
    //       icon: 'none'
    //     })
    //     return this.setData({keeperName: this.data.keeperName})
    //   }
    // }
    // if (name === 'telephone') {
    //   if(value.length > 11 && !(/^1(3|4|5|7|8)\d{9}$/.test(value))){ 
    //     return this.setData({telephone: this.data.telephone})
    //   }   
    // }
    // if (name === 'address') {
    //   if (value.length > 20) {
    //     wx.showToast({
    //       title: '地点过长',
    //       icon: 'none'
    //     })
    //     return this.setData({address: this.data.address})
    //   }
    // }
    this.setData({[name]: value})
  },
  changeService (e) {
    const idx = e.detail.value
    this.setData({selectedService: {...this.data.services[idx]}})
  },
  submit: async function(e) {
    const {shopName, selectedService, keeperName, telephone, address, shopkeeper} = this.data
    console.log(shopkeeper)
    if (!shopName) {
      return wx.showToast({
        title: '请填写商家名称',
        icon: 'none'
      })
    }
    if (!selectedService.name) {
      return wx.showToast({
        title: '请选择商家类型',
        icon: 'none'
      })
    }
    if (!keeperName) {
      return wx.showToast({
        title: '请填写联系人姓名',
        icon: 'none'
      })
    }
    if (!telephone) {
      return wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
    }
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(telephone))){ 
      return wx.showToast({
        title: '手机格式有误',
        icon: 'none'
      })
    }  
    if (!address) {
      return wx.showToast({
        title: '请填写地址',
        icon: 'none'
      })
    }
    if (!shopkeeper) {
      const res = await asyncRequest({url: `/merchantService/shopkeeper`,
        data: {
          shop_name: shopName, 
          keeper_name: keeperName, 
          service_id: selectedService.id, 
          address,
          telephone
        },
        method: 'post'
      })
      this.setData({shopkeeper: res.shopkeeper, showForm: false})
    } else {
      const res = await asyncRequest({
        url: `/merchantService/shopkeeper/${shopkeeper.id}`,
        data: {
          shop_name: shopName, 
          keeper_name: keeperName, 
          service_id: selectedService.id, 
          address,
          telephone
        },
        method: 'post'
      })
      this.setData({shopkeeper: res.shopkeeper, showForm: false})
    }
  },
  toShowForm: function () {
    this.setData({showForm: true})
  }
})
