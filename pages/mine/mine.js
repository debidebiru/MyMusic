// pages/mine/mine.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    recentPlayList:[],  //播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取用户基本信息
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      // 更新userInfo状态
        this.setData({
          userInfo
        })
        // 获取播放记录
        this.getRecentPlayList(this.data.userInfo.userId)
    }
  },
  // 获取播放记录函数
  async getRecentPlayList(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:1})
    // 为数据添加唯一数据方便wx：key取值
    let index =0
    let recentPlayList=recentPlayListData.weekData.splice(0,10).map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },

  // 跳转登录界面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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