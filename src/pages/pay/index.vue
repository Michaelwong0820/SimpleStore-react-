<template>
  <div>
    <!-- 1.收获地址选择 -->
    <view @click="chooseAddress" class="address">
      <view v-if="address" class="address-info">
        <view class="address-info-name-phone">
          <view>
            <text style="font-size:12px;">收货人：{{address.userName}}</text>
          </view>
          <view style="display:flex;align-items: center;">
            <text style="margin-right:36rpx;font-size:12px;">{{address.telNumber}}</text>
            <view class="iconfont-tap icon-jiantouyou"></view>
          </view>
        </view>
        <view class="address-info-detail-info">
          <text style="font-size:12px;">收货地址：{{address.detailAddress}}</text>
        </view>
      </view>
      <view v-else class="address-add">
        <text style="font-size:12px;">+ 新增地址</text>
      </view>
      <view class="address-pic">
        <image src="/static/img/cart_border@2x.png"/>
      </view>
    </view>
    <!-- 2.0 购买的商品列表 -->
    <view class="order-list">
      <block v-for="item in goodsList" :key="item.goods_id">
        <view class="product-item">
          <navigator class="product-left">
            <image :src="item.goods_small_logo"/>
          </navigator>
          <view class="product-right">
            <navigator class="product-name">{{item.goods_name}}</navigator>
            <view class="product-right-price">
              <text class="product-right-price-symbol">￥</text>
              <text class="product-right-price-integer">{{item.goods_price}}</text>
              <text class="product-right-price-decimal">.00</text>
            </view>
            <view class="product-right-num">x{{item.goods_number}}</view>
          </view>
        </view>
      </block>
    </view>
    <!-- 3.0 金额统计 -->
    <view class="order-total">
      <view class="order-total-item">
        <text>商品金额</text>
        <text class="order-total-item-price">￥{{totalAmount}}</text>
      </view>
      <view class="order-total-item">
        <text>运 费</text>
        <text class="order-total-item-price">￥+0.00</text>
      </view>
      <block v-if="token">
        <view @click="goToOrder" class="wxPay">微信支付</view>
      </block>
      <block v-else>
        <button @getuserinfo="wxLogin" open-type="getUserInfo" class="wxLogin">登录后下单支付</button>
      </block>
    </view>
  </div>
</template>

<script>
import { getLocalStoryge } from "../common/shopcarStoryge.js";
import chooseAddress from "../mixins/chooseAddress.js";
export default {
  mixins: [chooseAddress],
  data() {
    return {
      goodsList: [],
      token: null,
      totalAmount: 0,
    };
  },
  onLoad(option) {
    const ids = option.ids;
    this.getGoodsList(ids);
    if(wx.getStorageSync('token')) {
      this.token = wx.getStorageSync('token')
    }
     if(wx.getStorageSync('address')) {
      this.address = wx.getStorageSync('address')
    }
    wx.login({
      success: res => {},
      fail: () => {},
      complete: () => {}
    });
  },
  methods: {
    async getGoodsList(ids) {
      //从本地获取
      const localStoryge = getLocalStoryge();

      let res = await this.$https.get(`goods/goodslist?goods_ids=${ids}`);
      res.data.message.forEach(item => {
        item.goods_number = localStoryge[item.goods_id];
        this.totalAmount += item.goods_number * item.goods_price;
      });
      this.goodsList = res.data.message;
    },
    //微信登录
    wxLogin(e) {
      if (e.mp.detail.errMsg == "getUserInfo:fail auth deny") {
        return;
      }
      // 判断用户登录信息是否有效
      // const res2 = await new Promise ((resolve,reject)=>{
      //   wx.checkSession({
      //     success: res => {
      //       resolve(res)
      //     },
      //     fail: err => {
      //       reject(err)
      //     },
      //   });
      // })
      // let res = await new Promise((resolve, reject) => {
      //   wx.login({
      //     success: res => {
      //       resolve(res);
      //     },
      //     fail: err => {
      //       reject(err);
      //     },
      //     complete: () => {}
      //   });
      // });
      wx.login({
        success: async res => {
          let code = res.code;
          let { encryptedData, iv, rawData, signature } = e.mp.detail;
          const res1 = await this.$https.post("users/wxlogin", {
            code,
            encryptedData,
            iv,
            rawData,
            signature
          });
          // console.log(res1);

          if (res1.statusCode == 200) {
            this.token = res1.data.message.token;
            // console.log(this.token);
            wx.setStorageSync('token',res1.data.message.token)

          }
        }
      });
    },
    //微信支付
    async goToOrder () {
      if (!this.address) {
        wx.showToast({
          title: '请输入收获地址', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        return
      }
      const order = {
        order_price:this.totalAmount,
        consignee_addr:`${this.address.detailAddress}${this.address.username}${this.address.telNumber}`,
        goods:this.goodsList.map(item=>{
          return {
            goods_id:item.goods_id,
            goods_number:item.goods_number,
            goods_price:item.goods_price,
          }
        })
      }
      const res = await this.$https.post(`my/orders/create`,order)
      console.log(res);
      
    }
  }
};
</script>

<style scoped lang="less">
.address {
  height: 222rpx;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &-info {
    display: flex;
    height: 160rpx;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    &-name-phone {
      display: flex;
      justify-content: space-between;
      padding: 0rpx 30rpx;
    }
    &-detail-info {
      padding: 0rpx 30rpx;
    }
  }
  &-add {
    width: 360rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    margin: 100px auto;
    color: #999;
    background-color: #f4f4f4;
  }
  &-pic {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 15rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.iconfont-tap {
  font-family: "iconfont" !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-jiantouyou {
  position: absolute;
  top: 32rpx;
  right: 0;
}
.icon-jiantouyou:before {
  font-size: 24rpx;
  color: #999;
  line-height: 1;
  width: 15rpx;
  height: 25rpx;
}
.order-list {
  background-color: #fff;
}
.product-item {
  display: flex;
  padding: 30rpx 20rpx;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 20rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #ddd;
  }
  .product-left {
    width: 200rpx;
    height: 200rpx;
    background-color: #eee;
    margin-right: 26rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .product-right {
    width: 480rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .product-name {
      height: 84rpx;
      font-size: 30rpx;
      line-height: 1.4;
      /* 多行文字隐藏省略号 */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      text {
        color: #ff2d4a;
      }
      &-symbol,
      &-decimal {
        font-size: 28rpx;
      }
      &-integer {
        font-size: 44rpx;
      }
    }
    &-num {
      position: absolute;
      right: 0;
      bottom: 0;
      letter-spacing: 2rpx;
      color: #999;
    }
  }
}
.order-total {
  background-color: #fff;
  margin-top: 20rpx;
  height: 300rpx;
  &-item {
    height: 80rpx;
    display: flex;
    align-items: center;
    padding: 0rpx 30rpx;
    justify-content: space-between;
    &-price {
      color: #ff2d4a;
    }
  }
}
.wxLogin {
  margin-top: 10rpx;
  width: 720rpx;
}
.wxPay {
  margin-top: 10rpx;
  margin-left: 15rpx;
  width: 720rpx;
  background-color: #00c000;
  display: flex;
  height: 80rpx;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32rpx;
  border-radius: 5rpx;
}
</style>

