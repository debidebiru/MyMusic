// pages/home/home.js
import request from '../../utils/request'
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