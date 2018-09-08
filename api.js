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