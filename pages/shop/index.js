import {asyncRequest} from '../../api'
import { async } from '../../utils/runtime';
const regeneratorRuntime = require('../../utils/runtime.js')

var app = getApp()
Page({
  data: {
    userInfo: null,
    products: [],
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        tabName: '全部'
      }
    ],
    cart: {},
    amount: 0,
    count: 0,
    modalVisible: false,
    telephone: ''
  },
  // onShow:function(e){
  //   this.onLoad();
  // },
  onLoad: async function (options) {
    var vm = this;
    wx.getSystemInfo({
      success: (res) => {
        vm.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight
        });
      }
    })
    const {products} = await asyncRequest({
      url: `/product/${options.openid}/list`
    })
    this.setData({products, telephone: options.telephone})
  },
  addProduct: async function (e) {
    const {cart} = this.data
    const {id, price, name} = e.currentTarget.dataset
    if (cart[id]) {
      if (cart[id].amount >= 99) {
        return false
      }
      cart[id] = {
        amount: cart[id].amount + 1,
        price,
        name
      }
    } else {
      cart[id] = {
        amount: 1,
        price,
        name
      }
    }
    let amount = 0
    let count = 0
    for (let id in cart) {
      amount = amount + (cart[id].price * cart[id].amount)
      count += cart[id].amount
    }
    this.setData({cart, amount, count})
  },
  deleteProduct: async function (e) {
    const {cart} = this.data
    const {id, price, name} =  e.currentTarget.dataset
    if (cart[id] && cart[id].amount > 0) {
      cart[id] = {
        amount: cart[id].amount -1,
        price,
        name
      }
    } else {
      cart[id] = {
        amount: 0,
        price,
        name
      }
    }
    let amount = 0
    let count = 0
    for (let id in cart) {
      amount = amount + (cart[id].price * cart[id].amount)
      count += cart[id].amount
    }
    const data = {
      cart,
      amount,
      count
    }
    if (count === 0) {
      data.modalVisible = false
    }
    this.setData(data)
  },
  toggleModalVisible: async function () {
    this.setData({modalVisible: !this.data.modalVisible})
  },
  call: function (e) {
    const phoneNumber = e.currentTarget.dataset.telephone
    wx.makePhoneCall({
      phoneNumber
    })
  },
})
