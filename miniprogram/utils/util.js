const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//得到日期格式为XXXX-XX-XX的日期数据
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const getWeek = dates => {
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date(dates);
  let day = date.getDay();
  return show_day[day];
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getWeek: getWeek,
  showSuccess: showSuccess,
  showModal: showModal,
}

// 显示成功提示
var showSuccess = title => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 1500,
    mask: true
  })
}

// 显示失败提示
var showModal = (title, content, doStringify = false) => {
  wx.showModal({
    title,
    content: doStringify ? JSON.stringify(content) : content,
    showCancel: false,
  })
}