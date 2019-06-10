// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//获取数据库对象
const db = cloud.database()
//定义最大数据数量
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  //取出集合记录总数
  const countResult = await db.collection('notes')
    .where({
      notebook_id: event.notebook_id,
      year: event.year,
    })
    .count()
  const total = countResult.total
  if(total==0){
    return{
      data:[]
    }
  }else{
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('notes')
        .where({
          notebook_id: event.notebook_id,
          year: event.year,
        })
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
}