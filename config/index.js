const request = ({...params}) => {
  wx.request({
    ...params,
    url: 'host' + params.url
  })
}