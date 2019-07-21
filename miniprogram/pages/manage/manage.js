//获取绘图工具
var wxCharts = require('../../utils/wxcharts.js');
//获取数据库
const db = wx.cloud.database()
//获取应用实例  
var  app  =  getApp()
//获取工具
var util = require('../../utils/util.js')
var lineChart1 = [];
var lineChart2 = [];
var pieChart1 = null;
var pieChart2 = null;
var pieChart3 = null;
var pieChart4 = null;
Page({
    data:{

        /**
         * 账单页面使用变量
         */

        //账本id
        notebookId:'',
        //账单id
        noteId:'',
        // tab切换  
        currentTab:  0,
        current: 'tab1',
        //用户选择的日期
        newDate:'',  
        //当前日期(粒度为月)
        date:'',
        //年
        year:'',
        //月
        month:'',
        //日
        day:'',
        //总支出
        out:0,
        //总收入
        in:0,
        //json格式账单数组
        jsonItem: [],
        //每天支出总计数组
        dayCountOutArray: [],
        //每天收入总计数组
        dayCountInArray: [],
        //主题颜色
        color:'',

        /**
         * 遮罩层页面使用变量
         */

        //遮罩层是否显示(默认不显示)
        shows: false,

        /**
         * 添加账单页使用变量
         */

        //数字是否输入正确
        error:false,
        //当前日期(粒度为日)
        fullDate: '',
        //备注(支出收入通用)
        note: '',
        //消费项目(支出收入通用)
        item:'',
        //添加账单时输入的金额(支出收入通用)
        money:0,
        //用户选择的日期(默认为当前日期)(支出收入通用)
        addDate: '',
        //选框数组(支出收入通用)
        itemCovers: [],
        //支出图标数组
        itemOutIcon: ['iconfont icon-canyin', 'iconfont icon-gouwu', 'iconfont icon-riyongpin', 'iconfont icon-jiaotong', 'iconfont icon-shucai', 'iconfont icon-shuiguo', 'iconfont icon-lingshi', 'iconfont icon-yundong', 'iconfont icon-changge', 'iconfont icon-wifidianhuaqia', 'iconfont icon-fushi', 'iconfont icon-meirong-heicopy', 'iconfont icon-fangzi', 'iconfont icon-xuanzuo', 'iconfont icon-yingerpiaozhichi', 'iconfont icon-chengnianrennan', 'iconfont icon-jieban', 'iconfont icon-jipiao', 'iconfont icon-yanjiu', 'iconfont icon-weibiaoti2fuzhi03', 'iconfont icon-qiche', 'iconfont icon-yiliao', 'iconfont icon-youji', 'iconfont icon-xuexi', 'iconfont icon-xiedaichongwu', 'iconfont icon-hongbao', 'iconfont icon-liwuhuodong', 'iconfont icon-shangwu', 'iconfont icon-weixiu', 'iconfont icon-juanzeng', 'iconfont icon-caipiao', 'iconfont icon-kuaidi'],
        //收入图标数组
        itemInIcon: ['iconfont icon-gongzi', 'iconfont icon-jianzhi', 'iconfont icon-licai', 'iconfont icon-hongbao', 'iconfont icon-qita'],
        //图标id(支出收入通用)
        iconId: '',
        //支出图标名称数组
        itemOutName: ['餐饮', '购物', '日用', '交通', '蔬菜', '水果', '零食', '运动', '娱乐', '通讯', '服饰', '美容', '住房', '居家', '孩子', '长辈', '社交', '旅行', '烟酒', '数码', '汽车', '医疗', '书籍', '学习', '宠物', '礼金', '礼物', '办公', '维修', '捐赠', '彩票', '快递'],
        //收入图标名称数组
        itemInName: ['工资','兼职','理财','礼金','其他'],

        /**
         * 分析页使用变量
         */

        yearRange:'',
        monthRange:'',
        view1:false,
        view2:true,
        //分段器颜色
        theme:'',
    },

    onLoad: function (options) {
      //改变分段器颜色
      if (options.color =='#5cadff'){
        var the = 'positive'
      } else if (options.color == '#f76b6c'){
        var the = 'assertive'
      } else if (options.color == '#ffe300'){
        var the = 'energized'
      }else{
        var the = 'balanced'
      }
      //判断是否由详情页跳转
      if(options.date==null){
        var that =  this;
        //获取当前时间
        var str = util.formatDate(new Date());
        //将年月日分割
        var strs = str.split('-');
        this.setData({
          date: strs[0] + '-' + strs[1],
          year: strs[0],
          month: strs[1],
          day: strs[2],
          fullDate: str,
          addDate: str,
          notebookId: options.note_book_id,
          yearRange: strs[0],
          monthRange: strs[0] + '-' + strs[1],
          color: options.color,
          theme: the
        });
        //调用云函数查询帐单记录
        wx.cloud.callFunction({
          name:'getData',
          data:{
            notebook_id: this.data.notebookId,
            year: this.data.year,
            month: this.data.month,
          },
          success: res =>{
            that.setData({
              jsonItem: res.result.data,
            })
            //计算收入支出
            that.count();
            that.dayCount();
          },
          fail: err => {
            wx.showModal({
              title: '查询失败',
              content: '错误信息为：' + err.errMsg,
              showCancel: false,
            })
          }
        })     
      }else{
        var str1 = options.date.substr(0,4);
        var str2 = options.date.substr(5,2);
        var str = util.formatDate(new Date());
        var that = this;
        this.setData({
          date: str1 + '-' + str2,
          year: str1,
          month: str2,
          fullDate: str,
          addDate: str,
          notebookId: options.note_book_id,
        });
        //调用云函数查询帐单记录
        wx.cloud.callFunction({
          name: 'getData',
          data: {
            notebook_id: this.data.notebookId,
            year: this.data.year,
            month: this.data.month,
          },
          success: res => {
            that.setData({
              jsonItem: res.result.data,
            })
            //计算收入支出
            that.count();
            that.dayCount();
          },
          fail: err => {
            wx.showModal({
              title: '查询失败',
              content: '错误信息为：' + err.errMsg,
              showCancel: false,
            })
          }
        })
      }
      //变更noteId
      this.changeNoteId();
      //绘制右下角添加按钮
      var context = wx.createCanvasContext('addIcon')
      context.arc(30, 30, 30, 0, 2 * Math.PI)
      context.setFillStyle(this.data.color)
      context.fill()
      context.beginPath()
      context.setLineWidth(4)
      context.moveTo(18, 30)
      context.lineTo(42, 30)
      context.moveTo(30, 18)
      context.lineTo(30, 42)
      context.setStrokeStyle('#f9f9f9')
      context.stroke()
      context.draw()
    },

    //点击返回按钮重新加载主页
    onUnload: function () {
      wx.reLaunch({
        url: '/pages/note/note'
      })
    },
 
    //滑动切换tab 
    bindChange: function (e) {
      var that = this;
      that.setData({  currentTab:  e.detail.current });
      if (e.detail.current == 1) {
        that.bindRangeYearChange(this.data.year);
        that.bindRangeMonthChange(this.data.month);
      }
    },
    
    //点击tab切换 
    swichNav: function (e) {
      var that = this;
      if(this.data.currentTab === e.target.dataset.current){
        return  false;
      }else{
        that.setData({
          currentTab:  e.target.dataset.current
        });
      }
    },

  //点击添加按钮显示遮罩层与面板
  addItem: function (e) {
    this.data.itemCovers = new Array(32)
    this.setData({
      shows: true,
      itemCovers: this.data.itemCovers,
      iconId: '',
      error: false,
    })
  },

  //点击遮罩层将当前面板关闭
  close: function () {
    this.setData({
      shows: false,
      note:'',
    })
  },

  //对manage页的月份进行更改时查询数据库相应信息
  bindDateChange: function (e){
    var flag = true;
    var str = e.detail.value;
    var strs = str.split('-');
    this.setData({
      newDate: e.detail.value,
      year: strs[0],
      month: strs[1],
      jsonItem: [],
    });
    var that = this;
    //调用云函数查询帐单记录
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        notebook_id: this.data.notebookId,
        year: this.data.year,
        month: this.data.month,
      },
      success: res => {
        that.setData({
          jsonItem: res.result.data,
        })
        //计算收入支出
        that.count();
        that.dayCount();
      },
      fail: err => {
        wx.showModal({
          title: '查询失败',
          content: '错误信息为：' + err.errMsg,
          showCancel: false,
        })
      }
    })
  },

  //Tabbar切换
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  //将选定的消费项目变为主题色
  changeItem: function (e) {
    this.data.itemCovers = new Array(32)
    this.data.itemCovers[e.currentTarget.dataset.id - 1] = 'color:' + this.data.color
    this.setData({
      itemCovers: this.data.itemCovers,
      iconId: e.currentTarget.dataset.id,
    })
  },

  //在添加账单页更改日期时修改相应变量
  bindAddDateChange: function (e) {
    this.setData({
      addDate: e.detail.value,
    });
    //变更noteId
    this.changeNoteId();
  },

  //将账单信息添加至数据库
  entrueAddOutItem: function () {
    //判断是否选择了消费项目
    if (this.data.iconId == ''){
      this.setData({
        error: true,
      })
      wx.showModal({
        title: '请选择消费项目',
        content: '',
        showCancel:false,
      })
    //判断是否输入了金额
    } else if (this.data.money == 0){
      wx.showModal({
        title: '请输入金额',
        content: '',
        showCancel: false,
      })
    //判断是否输入了正确的金额
    }else if(this.data.error){
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
      var arr = []
      //将账单信息储存在json中
      var json = { "date": strs[0] + "年" + strs[1] + "月" + strs[2] + "日 " + week, "note": this.data.note, "iconName": this.data.itemOutName[this.data.iconId - 1], "itemOutIcon": this.data.itemOutIcon[this.data.iconId - 1], "money": this.data.money}
      //将json添加到数组中
      arr.push(json)
      //判断数据库中是否已经有该月份的纪录，如果有则更新，没有则添加
      if (this.data.noteId == '') {
        db.collection('notes').add({
          data: {
            year: strs[0],
            month: strs[1],
            day: strs[2],
            notebook_id: this.data.notebookId,
            item: arr,
          },
          //成功显示提示信息
          success(res) {
            
          },
          //失败显示提示信息
          fail(err) {
            wx.showModal({
              title: '创建失败',
              content: 'ErrorCode: ' + err.errCode,
              showCancel: false,
            })
          }
        })
      } else {
        db.collection('notes').doc(this.data.noteId).update({
          data: {
            item: db.command.push(json)
          },
          success(res) {
            
          },
          fail(err){
            wx.showModal({
              title: '出现错误',
              content: '错误信息为:' + err.errMsg,
              showCancel: false,
            })
          }
        })
      };
      db.collection('users').doc(this.data.notebookId).update({
        data: {
          number: db.command.inc(1)
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
        },
        fail(err) {
          wx.showModal({
            title: '出现错误',
            content: '错误信息为:' + err.errMsg,
            showCancel: false,
          })
        }
      });
      this.setData({
        shows: false,
        note: '',
      });
      this.jumpPage(strs);
    }
  },

  entrueAddInItem: function () {
    //判断是否选择了消费项目
    if (this.data.iconId == '') {
      this.setData({
        error: true,
      })
      wx.showModal({
        title: '请选择消费项目',
        content: '',
        showCancel: false,
      })
      //判断是否输入了金额
    } else if (this.data.money == 0) {
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
    } else {
      var str = this.data.addDate;
      let week = util.getWeek(str);
      var strs = str.split('-');
      var that = this;
      var arr = []
      //将账单信息储存在json中
      var json = { "date": strs[0] + "年" + strs[1] + "月" + strs[2] + "日 " + week, "note": this.data.note, "iconName": this.data.itemInName[this.data.iconId - 1], "itemOutIcon": this.data.itemInIcon[this.data.iconId - 1], "money": this.data.money}
      //将json添加到数组中
      arr.push(json)
      //判断数据库中是否已经有该月份的纪录，如果有则更新，没有则添加
      if (this.data.noteId == '') {
        db.collection('notes').add({
          data: {
            year: strs[0],
            month: strs[1],
            day: strs[2],
            notebook_id: this.data.notebookId,
            item: arr,
          },
          //成功显示提示信息
          success(res) {
            
          },
          //失败显示提示信息
          fail(err) {
            wx.showModal({
              title: '创建失败，请联系开发者',
              content: 'ErrorCode: ' + err.errCode,
              showCancel: false,
            })
          }
        });
      } else {
        db.collection('notes').doc(this.data.noteId).update({
          data: {
            item: db.command.push(json)
          },
          success(res) {
            
          },
          //失败显示提示信息
          fail(err) {
            wx.showModal({
              title: '创建失败，请联系开发者',
              content: 'ErrorCode: ' + err.errCode,
              showCancel: false,
            })
          }
        })
      }
      db.collection('users').doc(this.data.notebookId).update({
        data: {
          number: db.command.inc(1)
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask: true
          });
        }
      })
      this.setData({
        shows: false,
        note: '',
      });
      this.jumpPage(strs);
    }
  },

  //获取备注输入框中的文字并复制
  addNote: function (e) {
    this.setData({
      note: e.detail.detail.value
    });
  },

  //获取金额输入框中的数字并赋值
  addOutMoney: function (e) {
    this.setData({
      money: parseFloat(0 - e.detail.detail.value)
    })
  },

  //获取收入金额框内的数值
  addInMoney: function (e) {
    this.setData({
      money: parseFloat(e.detail.detail.value)
    })
  },

  //进入单个消费项目详情页
  bindItem: function (e) {
    var json = JSON.stringify(this.data.jsonItem);
    wx.navigateTo({
      url: '/pages/detail/detail?index=' + e.currentTarget.dataset.index + '&noteId=' + this.data.noteId + '&notebookId=' + this.data.notebookId + '&jsonItem=' + json,
    })
  },

  //判断金额输入框中是否输入了多余的小数点或过多的小数位
  clearNoNum: function (e) {
    var strs = e.detail.detail.value.split('.');
    if(strs.length>2){
      this.setData({
        error:true
      })
    }else if(strs.length==2){
      if(strs[1].length>2){
        this.setData({
          error: true
        })
      }else{
        this.setData({
          error: false
        })
      }
    }else{
      this.setData({
        error: false
      })
    }
  },

  //计算每月支出与收入
  count: function () {
    var outCount = 0;
    var inCount = 0;
    for (var i = 0; i < this.data.jsonItem.length;i++){
      for (var j = 0; j < this.data.jsonItem[i].item.length; j++){
        if (this.data.jsonItem[i].item[j].money < 0) {
          outCount = outCount - this.data.jsonItem[i].item[j].money
        } else {
          inCount = inCount + this.data.jsonItem[i].item[j].money
        }
      }
    }
    this.setData({
      out: outCount,
      in: inCount
    })  
  },

  //添加帐单后跳转页面
  jumpPage: function (e) {
    var strs = e;
    this.setData({
      newDate: strs[0] + '-' + strs[1],
      year: strs[0],
      month: strs[1],
      day: strs[2],
      noteId: '',
      jsonItem: [],
    });
    var that = this;
    this.changeNoteId();
    //调用云函数查询帐单记录
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        notebook_id: this.data.notebookId,
        year: this.data.year,
        month: this.data.month,
      },
      success: res => {
        that.setData({
          jsonItem: res.result.data,
        })
        //计算收入支出
        that.count();
        that.dayCount();
      },
      fail: err => {
        wx.showModal({
          title: '查询失败',
          content: '错误信息为：' + err.errMsg,
          showCancel: false,
        })
      }
    })
  },

  //计算每日支出和收入总计
  dayCount: function () {
    this.data.dayCountOutArray = []
    this.data.dayCountInArray = []
    for (var s = 0; s < this.data.jsonItem.length; s++) {
      this.data.dayCountOutArray.push(0)
      this.data.dayCountInArray.push(0)
    }
    for (var i = 0; i < this.data.jsonItem.length; i++){
      var dayIn = 0
      var dayOut = 0
      for(var j = 0; j < this.data.jsonItem[i].item.length; j++){
        if (this.data.jsonItem[i].item[j].money < 0){
          dayOut = dayOut - this.data.jsonItem[i].item[j].money
        }else{
          dayIn = dayIn + this.data.jsonItem[i].item[j].money
        }
      }
      this.data.dayCountOutArray[i] = dayOut
      this.data.dayCountInArray[i] = dayIn
    }
    this.setData({
      dayCountOutArray: this.data.dayCountOutArray,
      dayCountInArray: this.data.dayCountInArray,
    })
  },

  //点击图表相关操作
  touchYearHandler: function (e) {
    console.log(lineChart1.getCurrentDataIndex(e));
    lineChart1.showToolTip(e, {
      format: function (item, category) {
        return category + '月 ' + item.name + ':' + item.data
      }
    });
  },

  //根据日期查询是否有账单记录
  changeNoteId: function (){
    var that = this;
    var strs = this.data.addDate.split('-');
    db.collection('notes').where({
      notebook_id: this.data.notebookId,
      year: strs[0],
      month: strs[1],
      day: strs[2],
    })
      .get({
        success: function (res) {
          if(res.data.length==0){
            that.setData({
              noteId: ''
            })
          }else{
            that.setData({
              noteId: res.data[0]._id
            })
          }
          }
      })
  },

  //点击图标相关操作
  touchMonthHandler: function (e) {
    lineChart2.scrollStart(e);
  },

  //移动图表相关操作
  moveHandler: function (e) {
    lineChart2.scroll(e);
  },

  touchEndHandler: function (e) {
    lineChart2.scrollEnd(e);
    lineChart2.showToolTip(e, {
      format: function (item, category) {
        return category + '日 ' + item.name + ':' + item.data
      }
    });
  },

  drawYearCanvas: function (outarray,inarray) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    lineChart1 = new wxCharts({
      canvasId: 'lineCanvas1',
      type: 'line',
      categories: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      animation: true,
      series: [{
        name: '收入',
        data: inarray,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }, {
        name: '支出',
        data: outarray,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '金额 (元)',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  drawMonthCanvas: function (outarray, inarray, dayarray) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch(e) {
      console.error('getSystemInfoSync failed!');
    }
    lineChart2 = new wxCharts({
      canvasId: 'lineCanvas2',
      type: 'line',
      categories: dayarray,
      animation: false,
      series: [{
        name: '收入',
        data: inarray,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      },
      {
        name: '支出',
        data: outarray,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }
      ],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  drawYearOutPieCanvas: function (outrank1) {
    var outrank = [];
    for(var i=0;i<outrank1.length;i++){
      outrank.push({ 'name': this.data.itemOutName[i], 'data': outrank1[i]})
    }
    var rank = [];
    for(var a=0; a<5; a++){
      var flag1 = 0;
      var flag2 = -1;
      var flag3 = null;
      for (var i = 0; i < outrank.length; i++) {
        if(outrank[i].data>flag1){
          flag1 = outrank[i].data;
          flag2 = i;
          flag3 = outrank[i]
        }
      }
      if(flag3!=null){
        rank.push(flag3);
        outrank.splice(flag2, 1);
      }  
    };
    var flag4 = 0;
    for (var i = 0; i < outrank.length; i++){
      flag4 = flag4 + outrank[i].data;
    }
    if(flag4!=0){
      rank.push({ 'name': '其他', 'data': flag4 }) ;
    }
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if(rank.length==0){
      pieChart1 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas1',
        type: 'pie',
        series: [{'name': '未知', 'data':1}],
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    }else{
      pieChart1 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas1',
        type: 'pie',
        series: rank,
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    }  
  },

  drawYearInPieCanvas: function (inrank1) {
    var inrank = [];
    for (var i = 0; i < inrank1.length; i++) {
      inrank.push({ 'name': this.data.itemInName[i], 'data': inrank1[i] })
    }
    var rank = [];
    for (var a = 0; a < 5; a++) {
      var flag1 = 0;
      var flag2 = -1;
      var flag3 = null;
      for (var i = 0; i < inrank.length; i++) {
        if (inrank[i].data > flag1) {
          flag1 = inrank[i].data;
          flag2 = i;
          flag3 = inrank[i]
        }
      }
      if (flag3 != null) {
        rank.push(flag3);
        inrank.splice(flag2, 1);
      }
    };
    var flag4 = 0;
    for (var i = 0; i < inrank.length; i++) {
      flag4 = flag4 + inrank[i].data;
    }
    if (flag4 != 0) {
      rank.push({ 'name': '其他', 'data': flag4 });
    }
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (rank.length == 0) {
      pieChart2 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas2',
        type: 'pie',
        series: [{ 'name': '未知', 'data': 1 }],
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    } else {
      pieChart2 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas2',
        type: 'pie',
        series: rank,
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    }
  },

  drawMonthOutPieCanvas: function (outrank1) {
    var outrank = [];
    for (var i = 0; i < outrank1.length; i++) {
      outrank.push({ 'name': this.data.itemOutName[i], 'data': outrank1[i] })
    }
    var rank = [];
    for (var a = 0; a < 5; a++) {
      var flag1 = 0;
      var flag2 = -1;
      var flag3 = null;
      for (var i = 0; i < outrank.length; i++) {
        if (outrank[i].data > flag1) {
          flag1 = outrank[i].data;
          flag2 = i;
          flag3 = outrank[i]
        }
      }
      if (flag3 != null) {
        rank.push(flag3);
        outrank.splice(flag2, 1);
      }
    };
    var flag4 = 0;
    for (var i = 0; i < outrank.length; i++) {
      flag4 = flag4 + outrank[i].data;
    }
    if (flag4 != 0) {
      rank.push({ 'name': '其他', 'data': flag4 });
    }
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (rank.length == 0) {
      pieChart3 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas3',
        type: 'pie',
        series: [{ 'name': '未知', 'data': 1 }],
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    } else {
      pieChart3 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas3',
        type: 'pie',
        series: rank,
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    }
  },

  drawMonthInPieCanvas: function (inrank1) {
    var inrank = [];
    for (var i = 0; i < inrank1.length; i++) {
      inrank.push({ 'name': this.data.itemInName[i], 'data': inrank1[i] })
    }
    var rank = [];
    for (var a = 0; a < 5; a++) {
      var flag1 = 0;
      var flag2 = -1;
      var flag3 = null;
      for (var i = 0; i < inrank.length; i++) {
        if (inrank[i].data > flag1) {
          flag1 = inrank[i].data;
          flag2 = i;
          flag3 = inrank[i]
        }
      }
      if (flag3 != null) {
        rank.push(flag3);
        inrank.splice(flag2, 1);
      }
    };
    var flag4 = 0;
    for (var i = 0; i < inrank.length; i++) {
      flag4 = flag4 + inrank[i].data;
    }
    if (flag4 != 0) {
      rank.push({ 'name': '其他', 'data': flag4 });
    }
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (rank.length == 0) {
      pieChart4 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas5',
        type: 'pie',
        series: [{ 'name': '未知', 'data': 1 }],
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    } else {
      pieChart5 = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas5',
        type: 'pie',
        series: rank,
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    }
  },

  //分析页切换年或者月的范围
  onChange: function(e) {
    if (e.detail.key==0){
      this.setData({
        view1:false,
        view2:true,
      })
    }else{
      this.setData({
        view1: true,
        view2: false,
      });
    }
  },

  //点击更换年份后进行计算和绘图
  bindRangeYearChange: function(e) { 
    if (!isNaN(e)){
      var year = e;
    }else{
      var year = e.detail.value;
    }
    var that = this;
    var outarray = new Array(12);
    var inarray = new Array(12);
    var outrank = new Array(this.data.itemOutName.length);
    var inrank = new Array(5);
    for(var s=0;s<12;s++){
      outarray[s] = 0;
      inarray[s] = 0;
    }
    for (var s = 0; s < this.data.itemOutName.length; s++){
      outrank[s] = 0;
    }
    for(var s = 0; s < 5; s++){
      inrank[s] = 0;
    }
    this.setData({
      yearRange: year,
    })
    //调用云函数查询帐单记录
    wx.cloud.callFunction({
      name: 'getYearData',
      data: {
        notebook_id: this.data.notebookId,
        year: year,
      },
      success: res => {
        for (var i = 0; i < res.result.data.length; i++) {
          for (var j = 0; j < res.result.data[i].item.length; j++) {
            if (res.result.data[i].item[j].money < 0) {
              outarray[parseInt(res.result.data[i].month)] = outarray[parseInt(res.result.data[i].month)] - res.result.data[i].item[j].money
            } else {
              inarray[parseInt(res.result.data[i].month)] = inarray[parseInt(res.result.data[i].month)] + res.result.data[i].item[j].money
            }
          }
        }
        that.drawYearCanvas(outarray, inarray);
        for (var a = 0; a < that.data.itemOutName.length; a++) {
          for (var i = 0; i < res.result.data.length; i++) {
            for (var j = 0; j < res.result.data[i].item.length; j++) {
              if (res.result.data[i].item[j].money < 0) {
                if (res.result.data[i].item[j].iconName == that.data.itemOutName[a]) {
                  outrank[a] = outrank[a] - res.result.data[i].item[j].money;
                }
              } else {
                if (res.result.data[i].item[j].iconName == '工资') {
                  inrank[0] = inrank[0] + res.result.data[i].item[j].money;
                } else if (res.data[i].item[j].iconName == '兼职') {
                  inrank[1] = inrank[1] + res.result.data[i].item[j].money;
                } else if (res.data[i].item[j].iconName == '理财') {
                  inrank[2] = inrank[2] + res.result.data[i].item[j].money;
                } else if (res.data[i].item[j].iconName == '礼金') {
                  inrank[3] = inrank[3] + res.result.data[i].item[j].money;
                } else {
                  inrank[4] = inrank[4] + res.result.data[i].item[j].money;
                }
              }
            }
          }
        }
        that.drawYearOutPieCanvas(outrank);
        that.drawYearInPieCanvas(inrank);
      },
      fail: err => {
        wx.showModal({
          title: '查询失败',
          content: '错误信息为：' + err.errMsg,
          showCancel: false,
        })
      }
    })
  },

  //点击更换月份后进行计算和绘图
  bindRangeMonthChange: function (e) {
    var outrank = new Array(this.data.itemOutName.length);
    var inrank = new Array(5);
    var outArray = [];
    var inArray = [];
    var dayArray = [];
    if (!isNaN(e)) {
      var year = this.data.year;
      var month = e;
    } else {
      var str = e.detail.value.split('-');
      var year = str[0];
      var month = str[1];
    }
    for (var s = 0; s < this.data.itemOutName.length; s++) {
      outrank[s] = 0;
    }
    for (var s = 0; s < 5; s++) {
      inrank[s] = 0;
    }
    if (parseInt(month) == 2) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        for (var i = 0; i < 29; i++) {
          dayArray.push(i+1);
          outArray.push(0);
          inArray.push(0);
        }
      } else {
        for (var i = 0; i < 28; i++) {
          dayArray.push(i + 1);
          outArray.push(0);
          inArray.push(0);
        }
      }
    } else {
      if (parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) {
        for (var i = 0; i < 30; i++) {
          dayArray.push(i+1);
          outArray.push(0);
          inArray.push(0);
        }
      } else {
        for (var i = 0; i < 31; i++) {
          dayArray.push(i+1);
          outArray.push(0);
          inArray.push(0);
        }
      }
    }
    var that = this;
    this.setData({
      monthRange: year + '-' + month,
    })
    //调用云函数查询帐单记录并计算
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        notebook_id: this.data.notebookId,
        year: year,
        month: month,
      },
      success: res => {
        for(var i = 0; i < res.result.data.length; i++){
          for(var j = 0; j < res.result.data[i].item.length; j++){
            if (res.result.data[i].item[j].money < 0){
              outArray[parseInt(res.result.data[i].day) - 1] = outArray[parseInt(res.result.data[i].day) - 1] - res.result.data[i].item[j].money;
            }else{
              inArray[parseInt(res.result.data[i].day) - 1] = inArray[parseInt(res.result.data[i].day) - 1] + res.result.data[i].item[j].money;
            }
          }
        }
        that.drawMonthCanvas(outArray, inArray, dayArray);
        for (var a = 0; a < that.data.itemOutName.length; a++) {
          for (var i = 0; i < res.result.data.length; i++) {
            for (var j = 0; j < res.result.data[i].item.length; j++){
              if (res.result.data[i].item[j].money < 0) {
                if (res.result.data[i].item[j].iconName == that.data.itemOutName[a]) {
                  outrank[a] = outrank[a] - res.result.data[i].item[j].money;
                }
              } else {
                if (res.result.data[i].item[j].iconName == '工资') {
                  inrank[0] = inrank[0] + res.result.data[i].item[j].money;
                } else if (res.result.data[i].item[j].iconName == '兼职') {
                  inrank[1] = inrank[1] + res.result.data[i].item[j].money;
                } else if (res.result.data[i].item[j].iconName == '理财') {
                  inrank[2] = inrank[2] + res.result.data[i].item[j].money;
                } else if (res.result.data[i].item[j].iconName == '礼金') {
                  inrank[3] = inrank[3] + res.result.data[i].item[j].money;
                } else {
                  inrank[4] = inrank[4] + res.result.data[i].item[j].money;
                }
              }
            }
          }
        }
        that.drawMonthOutPieCanvas(outrank);
        that.drawMonthInPieCanvas(inrank);
      },
      fail: err => {
        wx.showModal({
          title: '查询失败',
          content: '错误信息为：' + err.errMsg,
          showCancel: false,
        })
      }
    })
  }
})