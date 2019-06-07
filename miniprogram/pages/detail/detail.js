//获取数据库
const db = wx.cloud.database();
//获取工具
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    noteId:'',
    notebookId:'',
    iconName:'',
    note:'',
    icon:'',
    type:'',
    money:0,
    date:'',
    index:-1,
    
    /**
    * 遮罩层页面使用变量
    */

    //遮罩层是否显示(默认不显示)
    shows: false,

    /**
     * 编辑页面使用变量
     */

    current: 'tab1',
    error: false,
    addDate: '',
    inmoney: '',
    outmoney: '',
    itemCovers:[],
    iconId:'',
    itemOutIcon: ['iconfont icon-canyin', 'iconfont icon-gouwu', 'iconfont icon-riyongpin', 'iconfont icon-jiaotong', 'iconfont icon-shucai', 'iconfont icon-shuiguo', 'iconfont icon-lingshi', 'iconfont icon-yundong', 'iconfont icon-changge', 'iconfont icon-wifidianhuaqia', 'iconfont icon-fushi', 'iconfont icon-meirong-heicopy', 'iconfont icon-fangzi', 'iconfont icon-xuanzuo', 'iconfont icon-yingerpiaozhichi', 'iconfont icon-chengnianrennan', 'iconfont icon-jieban', 'iconfont icon-jipiao', 'iconfont icon-yanjiu', 'iconfont icon-weibiaoti2fuzhi03', 'iconfont icon-qiche', 'iconfont icon-yiliao', 'iconfont icon-youji', 'iconfont icon-xuexi', 'iconfont icon-xiedaichongwu', 'iconfont icon-hongbao', 'iconfont icon-liwuhuodong', 'iconfont icon-shangwu', 'iconfont icon-weixiu', 'iconfont icon-juanzeng', 'iconfont icon-caipiao', 'iconfont icon-kuaidi'],
    itemOutName: ['餐饮', '购物', '日用', '交通', '蔬菜', '水果', '零食', '运动', '娱乐', '通讯', '服饰', '美容', '住房', '居家', '孩子', '长辈', '社交', '旅行', '烟酒', '数码', '汽车', '医疗', '书籍', '学习', '宠物', '礼金', '礼物', '办公', '维修', '捐赠', '彩票', '快递'],
    itemInIcon: ['iconfont icon-gongzi', 'iconfont icon-jianzhi', 'iconfont icon-licai', 'iconfont icon-hongbao', 'iconfont icon-qita'],
    itemInName: ['工资', '兼职', '理财', '礼金', '其他'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var i = parseInt(options.index);
    var jsonItem = JSON.parse(options.jsonItem);
    if (jsonItem[i].money<0){
      var t = '支出';
      var m = -jsonItem[i].money;
      var tab = 'tab1';
      var inmoney ='';
      var outmoney = -jsonItem[i].money;
      for (var a = 0; a < this.data.itemOutName.length; a++) {
        this.data.itemCovers = new Array(32);
        if (this.data.itemOutName[a] == jsonItem[i].iconName) {
          var index = a;
          this.data.itemCovers[a] = 'color:#5cadff;'
          break;
        }
      }
    }else{
      var t = '收入';
      var m = jsonItem[i].money;
      var tab = 'tab2';
      var inmoney = jsonItem[i].money;
      var outmoney = '';
      for (var a = 0; a < 5; a++) {
        this.data.itemCovers = new Array(5);
        if (this.data.itemInName[a] == jsonItem[i].iconName) {
          var index = a;
          this.data.itemCovers[a] = 'color:#5cadff;'
          break;
        }
      }
    }
    this.setData({
      iconId: index,
      itemCovers: this.data.itemCovers,
      inmoney: inmoney,
      outmoney: outmoney,
      current: tab,
      noteId: options.noteId,
      note: jsonItem[i].note,
      icon: jsonItem[i].itemOutIcon,
      type: t,
      money: m,
      date: jsonItem[i].date,
      iconName: jsonItem[i].iconName,
      index: i,
      item: jsonItem,
      notebookId: options.notebookId,
      addDate: jsonItem[i].date.slice(0, 4) + '-' + jsonItem[i].date.slice(5, 7) + '-' + jsonItem[i].date.slice(8, 10),
    })
  },

  //点击编辑按钮
  handleEdit: function (e) {
    this.setData({
      shows: true,
      error: false,
    })
  },

  //点击遮罩层将当前面板关闭
  close: function () {
    this.setData({
      shows: false,
    })
  },

  //Tabbar切换
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  //获取备注输入框中的文字并复制
  addNote: function (e) {
    this.setData({
      note: e.detail.detail.value
    });
  },

  //判断金额输入框中是否输入了多余的小数点或过多的小数位
  clearNoNum: function (e) {
    var strs = e.detail.detail.value.split('.');
    if (strs.length > 2) {
      this.setData({
        error: true
      })
    } else if (strs.length == 2) {
      if (strs[1].length > 2) {
        this.setData({
          error: true
        })
      } else {
        this.setData({
          error: false
        })
      }
    } else {
      this.setData({
        error: false
      })
    }
  },

  //获取支出金额输入框中的数字并赋值
  addOutMoney: function (e) {
    this.setData({
      money: parseFloat(0 - e.detail.detail.value)
    })
  },

  //获取收入金额输入框中的数字并赋值
  addInMoney: function (e) {
    this.setData({
      money: parseFloat(e.detail.detail.value)
    })
  },

  //将选定的消费项目变为蓝色
  changeItem: function (e) {
    this.data.itemCovers = new Array(32)
    this.data.itemCovers[e.currentTarget.dataset.id - 1] = 'color:#5cadff;'
    this.setData({
      itemCovers: this.data.itemCovers,
      iconId: e.currentTarget.dataset.id - 1,
    })
  },

  entrueAddOutItem: function (e) {
    if (this.data.money == 0) {
      wx.showModal({
        title: '请输入金额',
        content: '',
        showCancel: false,
      })
      //判断是否输入了正确的金额
    } else if (this.data.error) {
      wx.showModal({
        title: '请输入正确的金额',
        content: '',
        showCancel: false,
      })
    }else{
      var str = this.data.addDate;
      let week = util.getWeek(str);
      var strs = str.split('-');
      var that = this;
      var arr = [];
      //将账单信息储存在json中
      var json = { "date": strs[0] + "年" + strs[1] + "月" + strs[2] + "日 " + week, "note": this.data.note, "iconName": this.data.itemOutName[this.data.iconId], "itemOutIcon": this.data.itemOutIcon[this.data.iconId], "money": this.data.money, "day": strs[2] };
      that.data.item[that.data.index] = json;
      db.collection('notes').doc(that.data.noteId).update({
        data: {
          item: that.data.item
        },
        success(res) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
        },
        fail(err){
          wx.showModal({
            title: '修改失败',
            content: '错误信息为:' + err.errMsg,
            showCancel: false
          })
        }
      });
      that.setData({
        shows: false,
        icon: that.data.itemOutIcon[that.data.iconId],
        iconName: that.data.itemOutName[that.data.iconId],
      })
    }
  },

  handleDelete: function () {
    var that = this;
    wx.showModal({
      title: '确认要删除吗',
      content: '此操作不可恢复',
      success(res) {
        if (res.confirm) {
          that.data.item.splice(that.data.index,1);
          db.collection('notes').doc(that.data.noteId).update({
            data: {
              item: that.data.item
            },
            success(res) {
              db.collection('users').doc(that.data.notebookId).update({
                data: {
                  number: db.command.inc(-1)
                },
                success(res) {
                  wx.redirectTo({
                    url: '/pages/manage/manage?note_book_id=' + that.data.notebookId + '&date=' + that.data.date,
                  })
                },
                fail(err) {
                  wx.showModal({
                    title: '出现错误',
                    content: '错误信息为:' + err.errMsg,
                    showCancel: false,
                  })
                }
              })
            }
          });
        }
      }
    })
  },


})