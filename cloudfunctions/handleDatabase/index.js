// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('删除的notebookid为:' + event.notebook_id)
  try {
    return await db.collection('notes').where({
      notebook_id: event.notebook_id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}