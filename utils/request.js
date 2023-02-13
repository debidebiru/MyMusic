import config from './config'

export default  (url,data={},method='Get')=>{
 return new Promise((resolve,reject)=>{
   //因为要等待请求异步任务完成再传递返回值，所以使用await/async 所以返回的需要是
   //一个promise实例对象
   //new promise 修改promise 的状态为pending，使用resolve返回成功值
  wx.request({
  //使用本地地址请求url
    url:config.host+url,   
  // 使用内网穿透地址请求url
    // url:config.mobileHost+url,
    data,
    method,
    header:{
      cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U') !==-1):''
    },
    success:(res)=>{
      //console.log('请求成功',res);
      if(data.isLogin){  //如果是发起的是登录请求则保存cookies
        wx.setStorageSync('cookies', res.cookies)
      }
      resolve(res.data)//resolve修改promise的状态为成功状态resolved
    },
    fail:(err)=>{
     // console.log('请求失败',err);
      reject(err)//reject修改promise的状态为失败状态rejected
    },
  })
 })
}