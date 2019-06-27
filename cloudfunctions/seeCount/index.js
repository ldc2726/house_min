// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  console.log(event,context,789)
  try {
    return await db.collection('housing').doc(event._id).update({
      data: {
        seeCount: _.inc(1)
      }
    })
  } catch (e) {
    console.error(e)
  }
}