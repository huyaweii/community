//index.js
//获取应用实例
import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')
var app = getApp()
Page({
  data: {
    post: {},
    commentContent: '',
    comments: [],
    atUserId: null,
    atUserName: ''
  },
  onLoad: async function (options) {
    wx.showLoading({title: '加载中'})   
    const {post} = await asyncRequest({url: `/post/${options.id}`})
    const {comments} = await asyncRequest({url: `/post/${options.id}/comment`})
    wx.hideLoading()
    this.setData({post, comments})
  },
  onChange: function (e) {
    const name = e.currentTarget.dataset.name
    this.setData({[name]: e.detail.value})
  },
  submitComment: async function (e) {
    const {post, commentContent, comments, atUserId} = this.data
    if (commentContent === '') {
      return wx.showToast({
        title: '内容不能为空',
        icon: 'none',
      });
    }
    const {comment} = await asyncRequest({
      url: `/post/${post.id}/comment`,
      method: 'post',
      data: {
        atUserId,
        content: commentContent
      }
    })
    this.setData({commentContent: '', comments: comments.concat(comment)})
  },
  reply: function (e) {
    const {atUserId, atUserName} = e.currentTarget.dataset
    this.setData({atUserId, atUserName})
  }
})