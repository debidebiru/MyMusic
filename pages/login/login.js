// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',     //手机号
    email:'',      //邮箱
    password:'',  //密码
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  //表单内容改变
  handleInput(event){
    let type=event.currentTarget.id
    this.setData({
      [type]:event.detail.value
    })
  },
  // 登录函数
  async login(){
    let {email,password}=this.data
    //前端验证
    if(!email){
      wx.showToast({
        title: '邮箱不能为空',
        icon:'none'
      })
      return
    }
    // 正则
    let mailReg=/^[0-9a-zA-Z\_]{5,17}@[126|163]+.com$/;
    
    if(!mailReg.test(email)){
      wx.showToast({
        title: '邮箱格式错误',
        icon:'none'
      })
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
      return
    }
    // 后端验证
    let result =await request('/login',{email,password,isLogin:true})
    if(result.code==200){
      wx.showToast({
        title: '登陆成功',
      })
      //将个人信息存储在本地(读取和存储的数据最好是json数据)
      wx.setStorageSync('userInfo',result.profile)
      // 登录成功后跳转回个人中心(此处不能使用navigitto跳转，因为无法跳回tabBar页面
      // 也不能使用switchTab（虽然可以跳转到tabBar页面 但原本的页面仍然存在无法触发onLoad生命周期函数
      // 所以这里使用reLaunch跳转 销毁其他所有页面，这样就可以重新触发onLoad生命周期函数了
      wx.reLaunch({
        url: '/pages/mine/mine',
      })
    }else if(result.code==501){
      wx.showToast({
        title: '邮箱错误',
        icon:'none'
      })
    }else if(result.code==502){
      wx.showToast({
        title: '账号或密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '登陆失败',
        icon:'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})