export const request = ({...params}) => {
  wx.request({
    ...params,
    url: 'https://cmty.xyz' + params.url,
    // url: 'http://localhost:3000' + params.url,
    header: {
      token: wx.getStorageSync('token')
    },
    data: {
      ...params.data
    }
  })
}
export const asyncRequest = ({...params}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://cmty.xyz' + params.url,
      // url: 'http://localhost:3000' + params.url,
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        ...params.data
      },
      method: params.method || 'get',
      success: function (res) {
        if (res.data.error) {
          reject(res.data.error)
        }
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}