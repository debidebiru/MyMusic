import PubSub from 'pubsub-js'
import request from '../../utils/request'
// 为了操作全局音乐播放状态  获取全局实例
const appInstance =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,    //播放状态
    song:{},        //歌曲详情对象
    musicId:'',   //音乐id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options用于获取路由跳转携带的参数
    // 但是原生小程序中携带的参数有限，太过长的会被截取导致丢失部分参数
    let musicId =options.musicId
    this.setData({
      musicId
    })
    this.getSongInfo(musicId)
    // 判断当前音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===musicId){
      // 修改当前页面的音乐播放状态为true
      this.setData({
        isPlay:true
      })
    }



    // 如果用户通过系统控制音乐播放/暂停 而页面不知道，会导致当前播放状态与真实音乐状态不一致
    // 所以需要通过通过控制音频实例来监视音乐状态
    //创建控制音乐播放的实例对象
    this.backgroundAudioManager=wx.getBackgroundAudioManager()
    // 监视播放状态
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isPlay:true
      })
      // 修改全局音乐播放的状态
      appInstance.globalData.isMusicPlay=true
      appInstance.globalData.musicId=musicId
    })
    // 监视暂停状态
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay:false
      })
       // 修改全局音乐播放的状态
       appInstance.globalData.isMusicPlay=false
    })
    // 监视停止状态
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
       // 修改全局音乐播放的状态  
       appInstance.globalData.isMusicPlay=false
    })
  },
  // 获取音乐详情
  async getSongInfo(musicId){
    let songData=await request('/song/detail',{ids:musicId})
    this.setData({
      song:songData.songs[0]
    })
    // 动态修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 切换播放状态
  handleMusicPlay(){
    let isPlay=!this.data.isPlay
    let {musicId}=this.data
    this.musicControl(isPlay,musicId)
  },
  // 控制音乐播放/暂停
  async musicControl(isPlay,musicId){

    if(isPlay){//播放
      // 获取播放链接
      let musicLinkData=await request('/song/url',{id:musicId,br:320000})
      let musicLink=musicLinkData.data[0].url
      // 将播放链接设置为音频实例链接
      this.backgroundAudioManager.src=musicLink;
      this.backgroundAudioManager.title=this.data.song.name
    }else{//暂停
      this.backgroundAudioManager.pause()
    }
  },

  // 点击切歌
  handleSwitch(event){
    let type=event.currentTarget.id
    //关闭当前播放的音乐 
    this.backgroundAudioManager.stop()

    // 订阅来自recommendsong页面发布的musicId
    PubSub.subscribe('musicId',(msg,musicId)=>{
      console.log(musicId);

      // 获取音乐详情
      this.getSongInfo(musicId)
      // 切歌自动播放
      this.musicControl(true,musicId)
      // 取消订阅  解决多次触发订阅事件
      PubSub.unsubscribe('musicId')
    })
    // 发布消息给recommendsong页面
    PubSub.publish('switchType',type)
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