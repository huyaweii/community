const app = getApp()
import {asyncRequest} from '../../api'
import { async } from '../../utils/runtime';
const regeneratorRuntime = require('../../utils/runtime.js')

Page({
  data: {
    postList: [],
    page: 0,
    pageSize: 10,
    hasNextPage: true
  },
  onShow:function(e){
    this.onLoad();
  },
  onLoad: async function (options) {
    const {page, pageSize} = this.data
    const {postList} = await asyncRequest({url: '/post', data: {page: 0, pageSize}})
    this.setData({postList, hasNextPage: postList.length === pageSize, page: 0})
  },
  onReachBottom: async function () {
    let {page, pageSize, hasNextPage} = this.data
    if (hasNextPage) {
      page += 1
      wx.showLoading({title: '加载中'})
      const {postList} = await asyncRequest({
        url: `/post`,
        data: {page, pageSize}
      })    
      wx.hideLoading()
      this.setData({
        postList: this.data.postList.concat(postList), 
        page, 
        hasNextPage: postList.length === pageSize
      })
    }
  },
  toPublish: async function (options) {
    app.isAuthed('/pages/post/create/index', () => {
      wx.navigateTo({
        url: '/pages/post/create/index'
      });
    })
  },
  getUserInfo: async function (res) {
    console.log(res)
  }
})