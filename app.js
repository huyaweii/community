//app.js
import {request} from './api'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: loginResult => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request({
          url: '/login',
          data: {
              code: loginResult.code,
              // name: userInfo.nickName,
              // avatar: userInfo.avatarUrl,
              // gender: userInfo.gender
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('userId', res.data.user_id)
          }
        })
        this.getUserInfo()
        // wx.getUserInfo({
        //   success: function (userResult) {
        //     const userInfo = userResult.userInfo
        //   },

        //   fail: function (userError) {
        //       // var error = new LoginError(constants.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态');
        //       // error.detail = userError;
        //       // callback(error, null);
        //   },
        // });
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           const userInfo = res.userInfo
    //           this.globalData.userInfo = userInfo
    //           wx.request({
    //             url: 'http://localhost:3000/update_user',
    //             data: {
    //                 name: userInfo.nikename,
    //                 avatar: userInfo.avatarUrl,
    //                 gender: userInfo.gender
    //             },
    //             success: function (res) {
                  
    //             }
    //           })
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  getUserInfo() {
    const _this = this
    wx.getUserInfo({
      success: function (userResult) {
        const userInfo = userResult.userInfo
        _this.globalData.userInfo = userInfo
        request({
          url: '/update_user',
          data: {
              name: userInfo.nickName,
              avatar: userInfo.avatarUrl,
              gender: userInfo.gender,
              openid: wx.getStorageSync('openid')
          },
          method: 'post',
          success: function (res) {    
          }
        })
      },
      fail: function (userError) {
      }
    })
  },
  isAuthed(url, callback) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (callback) {
            callback()
          }
        } else {
        wx.navigateTo({
            url: `/pages/login/index?url=${url}`
          })
        }
      }
    })  
  },
  globalData: {
    userInfo: null,
    dynamicActivePage: 'nearby'
  }
})