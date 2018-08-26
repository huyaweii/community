//index.js
//获取应用实例
const app = getApp()
import {request} from '../../api'
import {anonymityList} from '../../config/index.js'
Page({
  data: {
    activePage: 'nearby',
    showSelectModal: false,
    nearbyPostList: [],
    anonymityPostList: [],
    postPage: 0,
    pageSize: 10,
    willReplyPostId: null,
    atUserId: null,
    anonymity: ''
  },
  onShow: function(e){
    this.onLoad();
  },
  onReachBottom: function () {
    const _this = this
    const {postPage, pageSize, nearbyPostList, anonymityPostList, count, pullUpLoading, activePage} = this.data
    let postList = (activePage === 'nearby' ? nearbyPostList : anonymityPostList)
    const postId = postList[postList.length - 1].id
    if (postList.length < count) {
      this.setData({pullUpLoading: true})
      const postId = postList[postList.length - 1].id
      request({
        url: '/post',
        data: {
          postPage,
          pageSize,
          postId,
          type: activePage
        },
        success: function (res) {
          if (activePage === 'nearby') {
            _this.setData({nearbyPostList: [...nearbyPostList, ...res.data.postList], pullUpLoading: false, postId})
          } else {
            _this.setData({anonymityPostList: [...postList, ...res.data.postList], pullUpLoading: false, postId})
          }
        }
      })
    }
  },
  onLoad: function (options) {
    const {activePage = 'nearby'} = options || {}
    this.setData({activePage})
    const {postPage, pageSize} = this.data
    const _this = this
    request({
      url: '/post',
      data: {
        postPage,
        pageSize,
        type: activePage
      },
      success: function (res) {
        _this.setData({nearbyPostList: res.data.postList, count: res.data.count})
      }
    })
  },
  changePostId: function(e) {
    const {activePage, anonymityPostList} = this.data
    let {postId, atUserId, commentPlaceholder, atUserName = ''} = e.currentTarget.dataset
    let anonymity = ''
    if (activePage === 'anonymity') {
      const index = anonymityPostList.findIndex(post => post.id === postId)
      const currentPostAnonymity = anonymityPostList[index].anonymity
      const tempAnonymitys = anonymityList.filter(anonymity => ![currentPostAnonymity].includes(anonymity))
      anonymity = tempAnonymitys[Math.floor(Math.random(0, 1) * tempAnonymitys.length)]
      commentPlaceholder = `花名为${anonymity},${commentPlaceholder}`
    }
    this.setData({willReplyPostId: postId, atUserId, commentPlaceholder, anonymity, atUserName})
  },
  changePage (e) {
    const activePage = e.currentTarget.dataset.page
    const {postPage, pageSize, anonymityPostList} = this.data
    const _this = this
    if (activePage === 'anonymity' && anonymityPostList.length === 0) {
      request({
        url: '/post',
        data: {
          postPage,
          pageSize,
          type: activePage
        },
        success: function (res) {
          _this.setData({anonymityPostList: res.data.postList})
        }
      })
    }
    this.setData({activePage: e.currentTarget.dataset.page})
  },
  toggleSelectModal () {
    const showSelectModal = !this.data.showSelectModal
    this.setData({showSelectModal})
  },
  closeCommentMask: function() {
    this.setData({willReplyPostId: null})
  },
  submitComment: function(e) {
    const {willReplyPostId, atUserId, atUserName, activePage} = this.data
    const content = e.detail.value
    if (!content) {
      return wx.showToast({title: '内容不能为空哦', icon: 'none'})
    }
    const data = {
      content: e.detail.value,
      post_id: willReplyPostId,
      at_user_id: atUserId
    }
    if (activePage === 'anonymity') {
      data.user_name = this.data.anonymity
      if (data.at_user_id) {
        data.at_user_name = this.data.atUserName
      }
    }
    request({
      url: '/post/reply',
      data,
      method: 'post',
      success: res => {
        if (activePage === 'nearby') {
          const nearbyPostList = [...this.data.nearbyPostList]
          const idx = nearbyPostList.findIndex(post => post.id === willReplyPostId)
          nearbyPostList[idx] = {
            ...nearbyPostList[idx],
            replys: [...nearbyPostList[idx].replys, res.data.reply]
          }
          this.setData({willReplyPostId: null, nearbyPostList})
        } else {
          const anonymityPostList = [...this.data.anonymityPostList]
          const idx = anonymityPostList.findIndex(post => post.id === willReplyPostId)
          anonymityPostList[idx] = {
            ...anonymityPostList[idx],
            replys: [...anonymityPostList[idx].replys, res.data.reply]
          }
          this.setData({willReplyPostId: null, anonymityPostList})
        }
      }
    })
  },
  praise: function(e) {
    const {status, postId} = e.currentTarget.dataset
    let nearbyPostList = [...this.data.nearbyPostList]
    const idx = nearbyPostList.findIndex(post => post.id === postId)
    nearbyPostList[idx] = {
      ...nearbyPostList[idx],
      isPraised: !status
    }
    this.setData({nearbyPostList})
    const data = {
      status: status ? 0 : 1,
      postId
    }
    request({
      url: '/post/praise',
      data,
      method: 'post',
      success: res => {
        console.log(res)
      }
    })
    // if () {
    //   console.log(e)
    // }
  }
})