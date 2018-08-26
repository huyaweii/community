export const request = ({...params}) => {
  wx.request({
    ...params,
    url: 'https://cmty.xyz' + params.url,
    data: {
      ...params.data,
      openid: wx.getStorageSync('openid')
    }
  })
}