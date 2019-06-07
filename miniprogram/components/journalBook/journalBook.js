const app = getApp()
const db = wx.cloud.database()
Component({
  properties: {
    journal_book_id: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    count: {
      type: Number,
      value: 0
    },
    background_id: {
      type: String,
      value: '0'
    },
    color_id: {
      type: String,
      value: '0'
    }
  },

  data: {
    bookCoverUrl: 'cloud://notebook-bf48f1.6e6f-notebook-bf48f1/cover/',
    bookCovers: [],
    mainColorUrl: 'cloud://notebook-bf48f1.6e6f-notebook-bf48f1/color/',
    mainColor: [],
    colorItem: ['#5cadff', '#f76b6c', '#ffe300','#4db199'],
    newName: '',
    style: ''
  },

  methods: {
    onSettingsTap: function() {
      // 初始化封面选中状态
      this.data.bookCovers = new Array(12)
      this.data.bookCovers[this.data.background_id - 1] = 'box-shadow: 0 0 12px #365c8d;'
      this.data.mainColor = new Array(4)
      this.data.mainColor[this.data.color_id - 1] = 'box-shadow: 0 0 12px #808080;'

      this.setData({
        newName: '',
        mainColor: this.data.mainColor,
        bookCovers: this.data.bookCovers,
        style: 'transform: rotateY(180deg);'
      })
    },

    onBookTap: function() {
      wx.navigateTo({
        url: '/pages/manage/manage?note_book_id=' + this.data.journal_book_id + '&color=' + this.data.colorItem[this.data.color_id - 1]
      })
    },

    onBlur: function(e) {
      this.setData({
        newName: e.detail.value
      })
    },

    //点击更换主题颜色
    onMainColorTap: function(e) {
      //更新主题颜色选中状态
      this.data.mainColor = new Array(4)
      this.data.mainColor[e.target.id - 1] = 'box-shadow: 0 0 12px #808080;'
      this.setData({
        color_id: e.target.id,
        mainColor: this.data.mainColor
      })
    },

    //点击更换封面
    onBookCoverTap: function(e) {
      // 更新封面选中状态
      this.data.bookCovers = new Array(12)
      this.data.bookCovers[e.target.id - 1] = 'box-shadow: 0 0 12px #365c8d;'

      this.setData({
        background_id: e.target.id,
        bookCovers: this.data.bookCovers
      })
    },

    onReturnButtonTap: function() {
      this.triggerEvent('refreshBookList')
      this.setData({
        style: ''
      })
    },

    onSubmitButtonTap: function() {
      var that = this
      db.collection('users').doc(this.data.journal_book_id).update({
        data: {
          name: this.data.newName ? this.data.newName : this.data.name,
          bookcover: this.data.background_id,
          color: this.data.color_id
        },
        success(res) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          that.setData({
            style: ''
          })
          that.triggerEvent('refreshBookList')
        },
        fail(err){
          if(err.errCode==-1){
            wx.showModal({
              title: '网络连接异常',
              content: '请确保您的网络连接稳定后点击重试按钮',
              showCancel: true,
              confirmText: "重试",
              success: function (res) {
                if (res.cancel) {
                  
                } else {
                  that.triggerEvent('refreshBookList')
                }
              }
            })
          }
        }
      })
    },

    onRemoveButtonTap: function() {
      var that = this
      var app = getApp
      wx.showActionSheet({
        itemList: ['确认移除'],
        itemColor: '#E64340',
        success: res => {
          wx.cloud.callFunction({
            name: 'handleDatabase',
            data: {
              notebook_id: this.data.journal_book_id
            },
            success: res => {
            },
            //失败显示提示信息
            fail: err => {
              wx.showToast({
                title: '获取OpenId异常',
                icon: 'loading',
                duration: 2000,
                mask: true
              })
            }
          })
          db.collection('users').doc(this.data.journal_book_id).remove({
            success(res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              that.setData({
                style: ''
              })
              that.triggerEvent('refreshBookList')
            },
            fail(err){
              wx.showModal({
                title: '删除失败，请联系开发者',
                content: 'ErrorCode: '+err.errCode,
                showCancel: false
              })
            }
          })
        }
      })
    }
  }
})