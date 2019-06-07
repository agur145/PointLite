const app = getApp()
const db = wx.cloud.database()
Component({
  data: {
    bookCoverUrl: '',
  },

  methods: {
    onBookTap: function() {
      wx.navigateTo({
        url: ''
      })
    },
  }
})