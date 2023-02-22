// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',    //导航的标识，记录点击了哪一个导航 给予css样式
    videoList:[],//视频列表数据 
    videoUrlList:[],//视频url地址数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
  },
  // 获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData=await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,10),
      navId:videoGroupListData.data[0].id
    
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据函数
  async getVideoList(navId){
    let videoListData=await request('/video/group',{id:navId})
    let index=0
    let videoList=videoListData.datas.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      videoList
    })
    this.getVideoUrlList()
  },
  // 获取视频url
  async getVideoUrlList(){
    let videoVidList=[]
    for(var i=0;i<this.data.videoList.length;i++){
      videoVidList.push(this.data.videoList[i].data.vid)
    }
    let arr=[]
    for(var x=0;x<videoVidList.length;x++){
      let obj={}
      let videoUrlListData=await request('/video/url',{id:videoVidList[x]})
      obj.vid=videoVidList[x]
      obj.url=videoUrlListData.urls[0].url
      arr.push(obj)
    }
    let videoList=this.data.videoList
    let index=0
    let vvvvv=videoList.map(item=>{
      item.url=arr[index++].url
      return item
    })
    // let id = this.data.videoList[0].data.vid
    
    // // let url=this.data.videoUrlList.push(videoUrlListData.urls[0].url)
    // let url=videoUrlListData.urls[0]
    this.setData({
      videoUrlList:vvvvv
    })
  },
  // 点击切换导航的回调
  changeNav(event){
    let navId=event.currentTarget.id
    this.setData({
      navId:navId*1  //转换为number
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