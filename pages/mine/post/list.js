//index.js
//获取应用实例
const app = getApp()
import {request} from '../../../api'
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    postList: [],
    willReplyPostId: null,
    atUserId: null,
    pullUpLoading: false,
    postPage: 0,
    pageSize: 10,
    count: null,
    commentPlaceholder: '请输入评论内容',
    loading: true
  },
  onReachBottom: function () {
    const _this = this
    const {postPage, pageSize, postList, count, pullUpLoading} = this.data
    if (postList.length < count) {
      this.setData({pullUpLoading: true})
      const postId = postList[postList.length - 1].id
      request({
        url: '/post',
        data: {
          postPage,
          pageSize,
          postId,
          type: 'community'
        },
        success: function (res) {
          _this.setData({postList: [...postList, ...res.data.postList], pullUpLoading: false, postId, postPage})
        }
      })
    }
  },
  onLoad: function (options) {
    const _this = this
    const {postPage, pageSize} = this.data
    const {type} = options || {}
    request({
      url: `/post/user/${wx.getStorageSync('openid')}`,
      data: {
          postPage,
          pageSize,
          type
      },
      success: function (res) {
        const {postList, count} = res.data
        _this.setData({postList, count, loading: false, type})
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  changePostId: function(e) {
    const {postId, atUserId, commentPlaceholder} = e.currentTarget.dataset
    this.setData({willReplyPostId: postId, atUserId, commentPlaceholder})
  },
  closeMask: function() {
    this.setData({willReplyPostId: null})
  }
})
