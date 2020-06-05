<template>
    <div v-if="goodsDetail">
        <!-- 轮播图 -->
        <swiper indicator-dots autoplay circular>
            <block v-for="(item,index) in goodsDetail.pics" :key="index">
                <swiper-item>
                    <image mode="aspectFill" @click="preview(item.pics_mid)" :src="item.pics_mid"></image>
                </swiper-item>
            </block>
        </swiper>
        <!-- 基本信息 -->
        <div class="product-info">
            <!-- 基本信息头部 -->
            <div class="product-head">
                <text class="price">${{goodsDetail.goods_price}}</text>
            </div>
            <!-- 基本信息尾部 -->
            <div class="product-body">
                <text class="product-name">{{goodsDetail.goods_name}}</text>
                <div class="product-like ">
                    <i class="iconfont icon-shoucang"></i>
                    <text>收藏</text>
                </div>
            </div>
            <div class="product-foot">
                <text>快递：免运费</text>
            </div>
        </div>
        <!-- 3.0 促销信息 -->
        <view class="part">
          <view class="part-item part-line">
          <text class="note">促销</text>
          <text class="color-main description">满300减30元</text>
        </view>
        <view class="part-item">
          <text class="note">已选</text>
          <text class="description">黑色/S/1件</text>
        </view>
        </view>
        <!-- 4.0 收获地址 -->
        <view class="part"  @click="chooseAddress">
          <view class="part-item">
          <text class="note">送至</text>
        <view v-if="address">
            {{address.provinceName}} {{address.cityName}} {{address.countyName}}
        </view>
        <view v-else>
          <text>请选择收货地址</text>
        </view>
        <view
          style="float:right;"
          class="iconfont icon-jiantouyou"
        ></view>
      </view>
        </view>
        <!-- 图文介绍和规则参数 -->
        <view class="tabs">
          <view class="tabs-head">
            <view @click="taggleSelect(index)" :class="['tabs-item',tabIndex==index?'active':'']"  v-for="(item,index) in tabs" :key="index">
              <text>{{item}}</text>
            </view>
          </view>
          <view class="tabs-body">
            <!-- 图文介绍 -->
            <view v-show="tabIndex ==0">
              <view v-html="goodsDetail.goods_introduce"></view>
            </view>
            <!-- 规格参数 -->
            <view v-show="tabIndex ==1">
              <view v-for="(item,index) in goodsDetail.attrs" :key="item.attr_id" class="param-item">
                <text :class="['note',index ===goodsDetail.attrs.length-1?'param-item-last':'']">{{item.attr_name}}</text>
                <text :class="['description',index === goodsDetail.attrs.length-1?'param-item-last':'']">{{item.attr_vals}}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 底部导航栏 -->
        <view class="fixed-bar">
          <view class="item">
        <button class="contact-btn" open-type="contact"></button>
        <view class="iconfont icon-kefu"></view>
        <text class="note">联系客服</text>
      </view>
      <view @click="goToShopCart" class="item">
        <view class="iconfont icon-gouwuche"></view>
        <text class="note">购物车</text>
      </view>
      <view class="btn-group">
        <view @click="addToShopCart" class="btn yellow-btn">加入购物车</view>
        <view class="btn red-btn">立即购买</view>
      </view>
        </view>
    </div>
</template>

<script>
import {addGoods} from '../common/shopcarStoryge.js'
import chooseAddress from '../mixins/chooseAddress.js'
export default {
  mixins:[chooseAddress],
    data() {
        return {
            goodsDetail:null,
            address:null,
            tabs:['图文介绍','规格参数'],
            tabIndex:0
        }
    },
    onLoad(option){
        //加载商品详情数据
        this.getGoods(option.goods_id)
        if(wx.getStorageSync('address')) {
            this.address = wx.getStorageSync('address')
        }
    },
    onReady(){

    },
    methods: {
        //获取商品详情数据
      async getGoods(goods_id){
          let res = await this.$https.get(`goods/detail?goods_id=${goods_id}`)
        
        this.goodsDetail=res.data.message
          
      } ,
      preview(current){
          wx.previewImage({
            urls: this.goodsDetail.pics.map(item=>item.pics_mid), //需要预览的图片链接列表,
            current:current
          });
      } ,
      
      //切换tab栏
      taggleSelect(index) {
        this.tabIndex = index
      },
      //跳转到购物车
      goToShopCart(){
        wx.switchTab({ url: '/pages/shopcar/main' });
      },
      //添加到购物车
      addToShopCart(){
        wx.showToast({
          title: '添加成功', //提示的内容,
          icon: 'none', //图标,
          image:'/static/img/duigou.png',
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        addGoods({
          goods_id:this.goodsDetail.goods_id,
          goods_number:1
        })
      }

    },
}
</script>

<style lang="less" scoped>
swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:750rpx;
    height: 400rpx;
  }
}
.product-info {
  display: flex;
  flex-direction: column;
  height: 300rpx;
  background-color: #fff;
  padding: 0 16rpx;
}

.product-head {
  height: 38rpx;
  padding: 40rpx 0;
}

.product-head .price {
  color: #ff2d4a;
  font-size: 50rpx;
  // margin-left: 10rpx;
}

.product-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-body .product-name {
  font-size: 34rpx;
  width: 546rpx;
  height: 88rpx;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-body .product-like {
  width: 50rpx;
  height: 78rpx;
  border-left: 1rpx solid #ddd;
  padding-left: 46rpx;
  margin-right: 30rpx;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.product-foot {
  font-size: 30rpx;
  color: #999;
  margin-top: 34rpx;
}

.part {
  background-color: #fff;
  margin: 20rpx 0;
  font-size: 32rpx;
  color: #999;
  &-line:after {
    content: '';
    height: 1rpx;
    width: 734rpx;
    background-color: #ddd;
    display: block;
    position: absolute;
    bottom: -1rpx;
  }
  &-item {
    display: flex;
    padding: 28rpx 16rpx;
    position: relative;
    align-items: center;
    // justify-content: space-between;
  }
}
.part .note {
  color: #333;
  margin-right: 40rpx;
}

.part .description {
  width: 490rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.part .color-main {
  color: #ff2d4a;
}

.tabs {
  &-head {
    height: 100rpx;
    background-color: #fff;
    display: flex;
    .active {
      color: #ff2d4a;
      font-weight: 400;
      &:after {
        content: '';
        height: 12rpx;
        width: 100%;
        background-color: #ff2d4a;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
  &-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: relative;
  }
  &-body {
    background-color: #fff;
    padding: 16rpx;
    margin-bottom: 100rpx;
  }
}
.param-item {
  display: flex;
  height: 100rpx;
  line-height: 100rpx;
  border-top: 1px solid rgba(92, 92, 92, 0.3);
  border-right: 1px solid rgba(92, 92, 92, 0.3);
  border-left: 1px solid rgba(92, 92, 92, 0.3);
}
.param-item .note {
  padding-left: 30rpx;
  width: 300rpx;
  border-right: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item-last {
  border-bottom: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item .description {
  padding-left: 30rpx;
  width: 400rpx;
}
.fixed-bar {
  width: 750rpx;
  height: 98rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
  .btn {
    width: 213rpx;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
  }
  .yellow-btn {
    background-color: #ffb400;
  }
  .red-btn {
    background-color: #ff2d4a;
  }
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .contact-btn {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .iconfont {
      width: 40rpx;
      height: 40rpx;
      font-size: 40rpx;
    }
    .note {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #666;
    }
  }
}
.iconfont .icon-shoucang {
  font-size: 50px;
  color: '#ff2d4a' !important;
}

.iconfont .icon-shoucang-fill {
  font-size: 50px;
  color: '#ff2d4a' !important;
}
</style>
