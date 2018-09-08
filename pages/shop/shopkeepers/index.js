import {request} from '../../../api'

var app = getApp()
Page({
  shopkeepers: [],
  onLoad: function (options) {
    const _this = this
    const {serviceId} = options
    request({
      url: `/merchantService/${serviceId}/shopkeepers`,
      data: {
      },
      success: function (res) {
       _this.setData({shopkeepers: res.data.shopkeepers})
      }
    })
  },
  praise: function (e) {
    const {status, shopkeeperId} = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    let shopkeepers = [...this.data.shopkeepers]
    console.log(shopkeeperId)
    const idx = shopkeepers.findIndex(shopkeeper => shopkeeper.id === shopkeeperId)
    console.log(shopkeepers[idx])
    shopkeepers[idx] = {
      ...shopkeepers[idx],
      is_praised: !status,
      praise_count: status ? shopkeepers[idx].praise_count - 1 : shopkeepers[idx].praise_count + 1
    }
    this.setData({shopkeepers}) 
    const data = {
      status: status ? 0 : 1,
      shopkeeperId,
      type: 'shopkeeper'
    }
    request({
      url: `/merchantService/shopkeeper/${shopkeeperId}/praise`,
      data,
      method: 'post',
      success: res => {
        console.log('点赞成功')
      }
    }) 
  }
})
