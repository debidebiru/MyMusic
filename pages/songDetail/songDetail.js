import PubSub from 'pubsub-js'
import request from '../../utils/request'
import moment from 'moment'
// 为了操作全局音乐播放状态  获取全局实例
const appInstance =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,    //播放状态
    isLike:true, //喜欢状态
    song:{},        //歌曲详情对象
    musicId:'',   //音乐id
    musicLink:'', //音乐链接
    currentTime:'00:00',//当前时长
    durationTime:'00:00',//总时长
    cutrrentWidth:0,  //实时进度条宽度
    likeSongsId:[],  //喜欢歌曲的id数组
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
    // 获取喜欢状态
    this.getLikeStatus()
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
    // 监听自然结束状态
    this.backgroundAudioManager.onEnded(()=>{
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
     // 自动切换至下一首音乐
     PubSub.publish('switchType','next')
    //  将实时进度条与时间还原为0
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // 实时播放时间
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      // 实时播放宽度
      let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  // 获取音乐详情
  async getSongInfo(musicId){
    let songData=await request('/song/detail',{ids:musicId})
    let durationTime=moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    // 动态修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 切换播放状态
  handleMusicPlay(){
    let isPlay=!this.data.isPlay
    let {musicId,musicLink}=this.data
    this.musicControl(isPlay,musicId,musicLink)
  },
  // 控制音乐播放/暂停
  async musicControl(isPlay,musicId,musicLink){

    if(isPlay){//播放
      if(!musicLink){
      // 获取播放链接
      let musicLinkData=await request('/song/url',{id:musicId,br:320000})
      musicLink=musicLinkData.data[0].url
      this.setData({
        musicLink
      })
      }
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
  // 检查喜欢状态
  async getLikeStatus(){
    // 获取喜欢音乐的id数组
    let userInfo = wx.getStorageSync('userInfo')
    let likeSongsId=await request('/likelist',{uid:userInfo.userId})
    this.setData({
      likeSongsIdList:likeSongsId.ids
    })
    // 如果当前音乐id存在与喜欢列表里则为喜欢状态
    let ids =this.data.likeSongsIdList.toString()
    let musicId=this.data.musicId
    let flag = ids.includes(musicId)
    this.setData({
      isLike:flag
    })
  },
  // 切换喜欢状态
  async handleLike(){
    let musicId=this.data.musicId
    let isLike=this.data.isLike
    let likeSwitch=!(isLike)
    let likeData=await request('/like',{id:musicId,like:likeSwitch})
      if(likeData.code===200){
        this.setData({
          isLike:likeSwitch
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