// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//获取数据库对象
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('notes')
    .where({
      notebook_id: event.notebook_id,
      year: event.year,
      month: event.month
    })
    .orderBy('day', 'desc')
    .get()
}