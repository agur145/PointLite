// pages/setting/setting.js
Page({
  goToAboutPage:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onLoad: function (options) {
    this.app = getApp()
  },
  onShow: function () {
    this.app.slideupshow(this, 'slide_up1', -200, 1)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this),200);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', -200, 1)
    }.bind(this), 400);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', -200, 1)
    }.bind(this), 600);
  },
  onHide: function () {
    this.app.slideupshow(this, 'slide_up1', 200, 0)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 200, 0)
    }.bind(this), 200);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', 200, 0)
    }.bind(this), 400);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', 200, 0)
    }.bind(this), 600);
  },
})