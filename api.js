export const request = ({...params}) => {
  wx.request({
    ...params,
    url: 'http://localhost:3000' + params.url
  })
}