export const request = ({...params}) => {
  wx.request({
    ...params,
    url: 'http://localhost:3000' + params.url,
    data: {
      ...params.data,
      openid: wx.getStorageSync('openid')
    }
  })
}