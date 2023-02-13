// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailySongsList:[],//每日推荐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登录
    let userInfo=wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title:'请先登录',
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.getDailySongs()
  },
  // 获取每日推荐数据
  async getDailySongs(){
    let dailySongsData=await request('/recommend/songs')
    this.setData({
      dailySongsList:dailySongsData.data.dailySongs
    })
  },
  // 跳转至歌曲详情页
  toSongDetail(event){
    // 通过传参获取歌曲信息
    let song=event.currentTarget.dataset.song
    wx.navigateTo({
    // 不能直接将song传参因为太长会被截取，所以传递id值通过查找id的接口实现获取歌曲详情
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
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