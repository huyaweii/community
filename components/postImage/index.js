Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    images: {
      type: Array,
      value: [],
    },
    size: {
      type: String,
      value: 'default'
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    preview: function(e) {
      const {current, urls} = e.currentTarget.dataset
      wx.previewImage(
        {
          current, 
          urls
        }
      )
    }
  }
})