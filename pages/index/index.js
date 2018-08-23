//index.js
//获取应用实例
const app = getApp()
import {request} from '../../api'
Page({
  data: {
    motto: 'Hello World',
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
    commentPlaceholder: '请输入评论内容'
  },

  onShow:function(e){
    this.onLoad();
  },
  onReachBottom: function () {
    const _this = this
    const {postPage, pageSize, postList, count, pullUpLoading} = this.data
    if (postList.length < count) {
      this.setData({pullUpLoading: true})
      const postId = postList[postList.length - 1].id
      request({
        url: '/posts',
        data: {
          postPage,
          pageSize,
          postId,
          type: 'community'
        },
        success: function (res) {
          _this.setData({postList: [...postList, ...res.data.postList], pullUpLoading: false, postId})
        }
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    const _this = this
    const {postPage, pageSize} = this.data
    request({
      url: '/home',
      data: {
          postPage,
          pageSize,
          postId: -1
      },
      success: function (res) {
        const {postList, count} = res.data
        _this.setData({postList, count})
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  test: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        } else {
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        }
      }
    })
  },
  changePostId: function(e) {
    const {postId, atUserId, commentPlaceholder} = e.currentTarget.dataset
    this.setData({willReplyPostId: postId, atUserId, commentPlaceholder})
  },
  // changePostId: function(e) {
  //   this.setData({wid})
  // }
  submitComment: function(e) {
    const {willReplyPostId, atUserId} = this.data
    const content = e.detail.value
    if (!content) {
      return wx.showToast({title: '内容不能为空哦', icon: 'none'})
    }
    request({
      url: '/reply_post',
      data: {
        content: e.detail.value,
        post_id: willReplyPostId,
        at_user_id: atUserId
      },
      method: 'post',
      success: res => {
        const postList = [...this.data.postList]
        const idx = postList.findIndex(post => post.id === willReplyPostId)
        postList[idx] = {
          ...postList[idx],
          replys: [...postList[idx].replys, res.data.reply]
        }
        this.setData({willReplyPostId: null, postList})
      }
    })
  },
  closeMask: function() {
    this.setData({willReplyPostId: null})
  }
})
