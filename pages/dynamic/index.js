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
    anonymity: '',
    loading: true,
    nearbyCount: 0,
    anonymityCount: 0,
  },
  onShow: function(e){
    this.onLoad();
  },
  onPullDownRefresh: function(){
    const {activePage} = this.data
    const _this = this
    request({
      url: '/post',
      data: {
        postPage: 0,
        pageSize: 10,
        type: activePage
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        if (activePage === 'nearby') {
          _this.setData({nearbyPostList: res.data.postList, nearbyCount: res.data.count, loading: false})
        } else {
          _this.setData({anonymityPostList: res.data.postList, anonymityCount: res.data.count, loading: false})
        }
      }
    })
  },
  onReachBottom: function () {
    const _this = this
    let {nearbyCount, anonymityCount, postPage, pageSize, nearbyPostList, anonymityPostList, count, pullUpLoading, activePage} = this.data
    let postList = (activePage === 'nearby' ? nearbyPostList : anonymityPostList)
    count = (activePage === 'nearby' ? nearbyCount : anonymityCount)
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
    const activePage = app.globalData.dynamicActivePage
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
        if (activePage === 'nearby') {
          _this.setData({nearbyPostList: res.data.postList, nearbyCount: res.data.count, loading: false})
        } else {
          _this.setData({anonymityPostList: res.data.postList, anonymityCount: res.data.count, loading: false})
        }
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
      this.setData({loading: true})
      request({
        url: '/post',
        data: {
          postPage,
          pageSize,
          type: activePage
        },
        success: function (res) {
          _this.setData({anonymityPostList: res.data.postList, loading: false, anonymityCount: res.data.count})
        }
      })
    }
    this.setData({activePage: e.currentTarget.dataset.page})
  },
  toggleSelectModal () {
    const {activePage} = this.data
    app.globalData.dynamicActivePage = activePage
    const _this = this
    app.isAuthed('/pages/dynamic/index', () => {
      const showSelectModal = !_this.data.showSelectModal
      _this.setData({showSelectModal})  
    })
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
    const {activePage} = this.data
    const {status, postId} = e.currentTarget.dataset

    if (activePage === 'nearby') {
      let nearbyPostList = [...this.data.nearbyPostList]
      const idx = nearbyPostList.findIndex(post => post.id === postId)
      nearbyPostList[idx] = {
        ...nearbyPostList[idx],
        isPraised: !status,
        praiseCount: status ? nearbyPostList[idx].praiseCount - 1 : nearbyPostList[idx].praiseCount + 1
      }
      this.setData({nearbyPostList})  
    } else {
      let anonymityPostList = [...this.data.anonymityPostList]
      const idx = anonymityPostList.findIndex(post => post.id === postId)
      anonymityPostList[idx] = {
        ...anonymityPostList[idx],
        isPraised: !status,
        praiseCount: status ? anonymityPostList[idx].praiseCount - 1 : anonymityPostList[idx].praiseCount + 1
      }
      this.setData({anonymityPostList}) 
    }

    const data = {
      status: status ? 0 : 1,
      postId,
      type: 'post'
    }
    request({
      url: '/post/praise',
      data,
      method: 'post',
      success: res => {
        console.log('点赞成功')
      }
    })
  },
  preview: function(e) {
    const {idx, urls} = e.currentTarget.dataset
    wx.previewImage(
      {
        current: idx, 
        urls
      }
    )
  }
})