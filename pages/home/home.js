// pages/home/home.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SwiperList:{},
    singer:{},//热门歌手数据
    topList:{},//排行榜数据
    newMusic:{}//最新音乐数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSwiperList()
    this.getsinger()
    this.getTopList()
    this.getNewMusic()
  },
  // 轮播图请求函数
  getSwiperList(){
    wx.request({
      url: 'https://www.escook.cn/slides',
      method:"GET",
      success:(res)=>{
        this.setData({
          SwiperList:res.data
        })
      }
    })
  },
  //使用封装请求函数改写请求歌手
  // getsinger:function(){
  //   wx.request({
  //     url: 'http://localhost:3000/top/artists',
  //     dataType:'json',
  //     success:(res)=>{
  //       this.setData({
  //         singer:res.data.artists
  //       })
  //       console.log(this.data.singer)
  //     }
  //   })
  // },
   //使用封装请求函数改写请求歌手函数
  getsinger:async function(){
    let singerList=await request('/top/artists')
    this.setData({
      singer:singerList.artists
    })
  },
  //从这里开始使用封装请求函数
  // 请求排行榜函数
  getTopList:async function(){
    let index=0;
    let resultArr=[];
    let idList=[19723756,3779629,2884035]
    while(index<3)
    {
      let topListData=await request('/top/list',{id:idList[index++]})
      console.log(topListData);
      let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    }
   
  },  
  // 封装改写请求最新音乐函数
  // getNewMusic:function(){
  //   wx.request({
  //     url: 'http://localhost:3000/personalized/newsong',
  //     dataType:'json',
  //     success:(res)=>{
  //       this.setData({
  //         newMusic:res.data.result
  //       })
  //       console.log(this.data.newMusic)
  //     }
  //   })
  // },
  getNewMusic:async function(){
    let newMusicList=await request('/personalized/newsong')
    this.setData({
      newMusic:newMusicList.result
    })
    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,type)=>{
      let {newMusic,index} =this.data
      if(type==='pre'){//上一首
        // 如果是第一首则衔接最后一首
        (index===0)&&(index=newMusic.length)
        index-= 1
      }else{ //下一首
        // 如果是最后一首则衔接第一首
        (index===newMusic.length-1)&&(index=-1)
        index+= 1
      }
      // 更新下标
      this.setData({
        index
      })
      let musicId =newMusic[index].id
      // 将上/下首音乐的musicId发送给songDetail
      PubSub.publish('musicId',musicId)
    })
  },
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },
   // 跳转至歌曲详情页
   toSongDetail(event){
    //  判断是否登录
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
    // 通过传参获取歌曲信息
    let {song,index}=event.currentTarget.dataset
    this.setData({
      index
    })
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
    wx.stopPullDownRefresh()
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