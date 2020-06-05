import Vue from 'vue'
import axios from 'axios'

//设置统一路径
axios.defaults.baseURL ='http://127.0.0.1:8899/api/public/v1/'

//设置拦截器
axios.interceptors.request.use(function(config) {
    if (mpvue.getStorageSync('token')) {
      config.headers.Authorization = mpvue.getStorageSync('token')
    }
      return config
})
//使用适配器
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '数据加载中...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => { }
    });
    wx.request({
      url: config.url, //开发者服务器接口地址",
      data: config.data, //请求的参数",
      method: config.method,
      header:config.headers,
      dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  });
}

//添加到vue原型中
Vue.prototype.$https = axios