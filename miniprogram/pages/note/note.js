const db = wx.cloud.database()
var util = require('../../utils/util.js')
Page({
  //页面数据
  data:{
    code: '',
    id: '',
    bookList: [],
    //手账本封面地址
    bookCoverUrl:'cloud://notebook-bf48f1.6e6f-notebook-bf48f1/cover/',
    //主题颜色图片地址
    mainColorUrl: 'cloud://notebook-bf48f1.6e6f-notebook-bf48f1/color/',
    //封面选框数组
    bookCovers: [],
    //主题颜色选框数组
    mainColor: [],
    //手账本名称
    name: '',
    //主题颜色id,默认为蓝色
    color_id: '1',
    //封面图片id，默认为第一张图片
    background_id: '1',
  },
  
  //背景图动画展示
  showAnimated: function () {
    var t = this;
    0 === this.data.currentIndex ? (setTimeout(function () {
      t.setData({
        one_one: "animated fadeIn",
        one_two: "animated bounceIn"
      })
    }, 1e3),
      setTimeout(function () {
        t.setData({ one_three: "animated bounceIn" })
      }, 1500),
      setTimeout(function () {
        t.setData({ one_four: "animated bounceIn" })
      }, 1800),
      setTimeout(function () {
        t.setData({ one_five: "animated lightSpeedIn" })
      }, 1900)) : 1 === this.data.currentIndex && (setTimeout(function () {
        t.setData({ two_one: "animated fadeInDown", two_two: "animated fadeInUp" })
      }, 1e3),
        setTimeout(function () {
          t.setData({ two_three: "animated zoomIn", two_four: "animated zoomIn" })
        }, 1200),
        setTimeout(function () {
          t.setData({ two_three: "two-music-one", two_four: "two-music-two" })
        }, 2200))
  },
  
  //背景图动画清除
  cleanAnimated: function () {
    0 === this.data.oldIndex ? this.setData({
      one_one: "animated fadeOut",
      one_two: "animated fadeOut",
      one_three: "animated fadeOut",
      one_four: "animated fadeOut",
      one_five: "animated fadeOut"
    }) : 1 === this.data.oldIndex && this.setData({
      two_one: "animated fadeOut",
      two_two: "animated fadeOut",
      two_three: "animated fadeOut",
      two_four: "animated fadeOut",
      two_five: "animated fadeOut"
    })
  },

  onShow: function () {
    //展示背景图动画
    this.showAnimated();
    var t = this;
    setTimeout(function () {
      // t.setData({ bottom_top: "animated slideInUp" })
    }, 2e3),
      setTimeout(function () {
        t.setData({ bottom_one: "animated slideInUp" })
      }, 2100),
      setTimeout(function () {
        t.setData({ bottom_two: "animated slideInUp" })
      }, 2200),
      setTimeout(function () {
        t.setData({ bottom_three: "animated slideInUp" })
      }, 2300), setTimeout(function () {
        t.setData({ bottom_four: "animated slideInUp" })
      }, 2400),
      setTimeout(function () {
        t.setData({ bottom_one: "bottom-4s-move" })
      }, 3100),
      setTimeout(function () {
        t.setData({ bottom_two: "bottom-3s-move" })
      }, 3200),
      setTimeout(function () {
        t.setData({ bottom_three: "bottom-2s-move" }
        )
      }, 3300),
      setTimeout(function () {
        t.setData({ bottom_four: "bottom-1s-move" })
      }, 3400)
  },

  onHide: function () {
    //清除背景图动画
    this.cleanAnimated(),
      this.setData({
        bottom: "",
        bottom_one: "",
        bottom_two: "",
        bottom_three: "",
        bottom_four: ""
      })
  },

  onLoad: function () {
    //初始化云服务器
    wx.cloud.init()
    //获取应用实例
    var app = getApp();
    //调用login云函数获取openId
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      //成功后将openId赋值给全局变量
      success: res => {
        app.globalData.openId = res.result.openid

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
    var that = this
    //根据获取到的openId向数据库请求对应数据
    db.collection('users').where({
      _openid: app.globalData.openId,
    })
      .get({
        //成功后将获取到的数组传递给bookList
        success(res) {
          that.setData({
            bookList: res.data
          })
        },
        //失败后显示提示信息
        fail(err){
          wx.showModal({
            title: '获取数据库信息失败，请联系开发者',
            content: 'ErrorCode: '+err.errCode,
            showCancel: false
          })
        }
      })
  },

  //创建新的手账本
  onNewJournalBookTap: function () {
    //初始化封面及主题颜色选框
    this.data.bookCovers = new Array(12)
    this.data.bookCovers[0] = 'box-shadow: 0 0 12px #365c8d;'
    this.data.mainColor = new Array(4)
    this.data.mainColor[this.data.color_id - 1] = 'box-shadow: 0 0 12px #808080;'
    
    //使页面翻转
    this.setData({
      bookCovers: this.data.bookCovers,
      mainColor: this.data.mainColor,
      style: 'transform: rotateY(180deg);'
    })
  },

  //输入框失去焦点后将数据传递给name
  onBlur: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //更新封面选框状态，储存选择的封面信息
  onBookCoverTap: function (e) {
    // 更新封面选中状态
    this.data.bookCovers = new Array(12)
    this.data.bookCovers[e.target.id - 1] = 'box-shadow: 0 0 12px #365c8d;'

    //更改封面图片id和选框位置
    this.setData({
      background_id: e.target.id,
      bookCovers: this.data.bookCovers
    })
  },

  //点击更换主题颜色
  onMainColorTap: function (e) {
    //更新主题颜色选中状态
    this.data.mainColor = new Array(4)
    this.data.mainColor[e.target.id - 1] = 'box-shadow: 0 0 12px #808080;'
    this.setData({
      color_id: e.target.id,
      mainColor: this.data.mainColor
    })
  },

  //点击返回按钮后的页面翻转
  onReturnButtonTap: function () {
    this.setData({
      style: ''
    })
  },

  //点击确认按钮后将数据传递给云
  onSubmitButtonTap: function () {
    var that = this
    db.collection('users').add({
      data: {
        name: this.data.name ? this.data.name : '我的账单',
        bookcover: this.data.background_id,
        color: this.data.color_id,
        number: parseInt(0),  
      },
     
      //成功显示提示信息
      success(res) {
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 1500,
          mask: true
        })
        that.setData({
          style: ''
        })
        that.onLoad()
      },
      //失败显示提示信息
      fail(err) {
        wx.showModal({
          title: '创建失败，请联系开发者',
          content: 'ErrorCode: '+err.errCode,
          showCancel: false,
        })
      }
    })
  },
  
  //刷新页面
  onRefreshBookList: function () {
    this.onLoad()
  }
})
