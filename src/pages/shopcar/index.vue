<template>
  <div>
    <view v-if="isEmpty">
      <!-- 空购物车 -->
      <view class="empty-car">
        <image src="/static/img/kong.png" />
        <text class="empty-car-tips">购物车还是空的</text>
        <text class="extra">快去逛逛吧~</text>
      </view>
    </view>
    <view v-else>
      <view class="shop-head">
        <view class="shop-head-info">
          <view class="iconfont icon-shop flex-center icon-dianpu"></view>
          <text class="shop-name">品优购生活馆</text>
        </view>
      </view>
      <!-- 列表 -->
      <block v-for="item in shopCarData" :key="item.goods_id">
        <view class="goods-item">
          <!-- 左边选中的图标 -->
          <view
            @click="toggleSelect(item)"
            :class="['pubIcon',item.isSelect ? 'trueIcon' : 'falseIcon']"
          ></view>
          <!-- 中间的图片 -->
          <view class="goods-item-pic">
            <image :src="item.goods_small_logo" />
          </view>
          <!-- 右边的商品信息 -->
          <view class="goods-item-info">
            <text class="goods-item-info-title">{{item.goods_name}}</text>
            <text class="goods-item-info-price">￥{{item.goods_price}}</text>
            <view class="goods-item-info-edit">
              <view class="outer">
                <view
                  :style="{'color':item.goods_number == 1 ? '#ccc' : 'black'}"
                  @click="substrict(item)"
                >-</view>
                <view class="value">
                  <input
                    style="font-size:12px;color:#999;"
                    v-model="item.goods_number"
                    @blur="changeValue(item)"
                    type="number"
                  >
                </view>
                <view @click="add(item)" class="add">+</view>
              </view>
              <text @click="deleteGoods(item)">| 删除</text>
            </view>
          </view>
        </view>
      </block>
      <!-- 工具条 -->
      <view class="fixed-bar">
        <view @click="toggleAllSelect" class="allselect">
          <!-- 左边选中的图标 -->
          <view :class="['pubIcon',allSelected ? 'trueIcon' : 'falseIcon']"></view>
          <text style="margin-left:10rpx;color:#999;">全选</text>
        </view>
        <view class="statistics">
          <view>
            <text>合计：</text>
            <text style="color:#ff2d4a;font-size:30rpx;">￥{{totalPrice}}</text>
          </view>
          <view>
            <text>包含运费</text>
          </view>
        </view>
        <view @click="goToOrderAndPay" :class="['jiesuan',totalCount === 0 ? 'disabled':'']">
          <text>去结算 ({{totalCount}})</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import {
  getLocalStoryge,
  updataGoods,
  delGoods
} from "../common/shopcarStoryge.js";
export default {
  data() {
    return {
      shopCarData: [],
      isEmpty: true,
      allSelected: true
    };
  },
  onShow() {
    this.getShopCarData();
  },
  computed: {
    totalPrice() {
      let totalprice = 0;
      this.shopCarData.forEach(item => {
        if (item.isSelect) {
          totalprice += item.goods_number * item.goods_price;
        }
      });
      return totalprice;
    },
    totalCount() {
      let totalcount = 0;
      this.shopCarData.forEach(item => {
        if (item.isSelect) {
          totalcount += item.goods_number;
        }
      });
      return totalcount;
    }
  },
  methods: {
    //加载购物车数据
    async getShopCarData() {
      let localStoryge = getLocalStoryge();
      let ids = Object.keys(localStoryge);
      if (ids.length === 0) {
        this.isEmpty = true;
        return;
      }
      this.isEmpty = false;
      let res = await this.$https.get(`goods/goodslist?goods_ids=${ids}`);
      res.data.message.forEach(item => {
        item.goods_number = localStoryge[item.goods_id];
        item.isSelect = true;
      });
      this.shopCarData = res.data.message;
    },
    //点击选中框
    toggleSelect(item) {
      item.isSelect = !item.isSelect;
      let allSelected = true;
      this.shopCarData.some(item => {
        if (!item.isSelect) {
          allSelected = false;
          return true;
        }
      });
      this.allSelected = allSelected;
    },
    //点击全选项
    toggleAllSelect() {
      this.allSelected = !this.allSelected;
      this.shopCarData.forEach(item => {
        item.isSelect = this.allSelected;
      });
    },
    //数量减少
    substrict(item) {
      item.goods_number--;
      updataGoods({
        goods_id: item.goods_id,
        goods_number: item.goods_number
      });
    },
    //数量增加
    add(item) {
      item.goods_number++;
      updataGoods({
        goods_id: item.goods_id,
        goods_number: item.goods_number
      });
    },
    //修改数量
    changeValue(item) {
      if (item.goods_number) {
        item.goods_number = parseInt(item.goods_number);
        if (item.goods_number <= 0) {
          item.goods_number = 1;
        }
        updataGoods({
          goods_id: item.goods_id,
          goods_number: item.goods_number
        });
      }
    },
    //删除商品
    deleteGoods(item) {
      wx.showModal({
        title: "提示", //提示的标题,
        content: "确定删除此商品", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#ff2d4a", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            delGoods(item.goods_id);
            //从购物车中删除
            const index = this.shopCarData.findIndex(delitem => {
              return delitem.goods_id == item.goods_id;
            });
            this.shopCarData.splice(index, 1);
            this.isEmpty = truethis.shopCarData.length == 0
    
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    //去支付页面
    goToOrderAndPay() {
      const ids = []
      this.shopCarData.forEach(item=>{
        ids.push(item.goods_id)
      })
      if(ids.length == 0) {
        wx.showToast({
          title: '请选择商品结算', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return

      }
      wx.navigateTo({ url: `/pages/pay/main?ids=${ids.join(',')}` });
    }
  }
};
</script>

<style lang="less" scoped>
@PADDING-LEFT: 20rpx;
.empty-car {
  display: flex;
  flex-direction: column;
  height: 500rpx;
  justify-content: center;
  align-items: center;
  image {
    width: 125rpx;
    height: 124rpx;
  }
  &-tips {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #666;
  }
}
.extra {
  font-size: 24rpx;
  color: #999;
}
.shop-head {
  background-color: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 @PADDING-LEFT;
  border-bottom: 1px solid #ddd;
  &-info {
    display: flex;
    align-items: center;
    .shop-name {
      margin-left: 10rpx;
    }
  }
}
.goods-item {
  height: 220rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: @PADDING-LEFT;
  border-bottom: 1px solid #eee;
  &-pic {
    width: 160rpx;
    height: 160rpx;
    margin-left: 10rpx;
    border: 1px solid #ddd;
    padding: 10rpx;
    border-radius: 5rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-info {
    flex: 1;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0rpx @PADDING-LEFT;
    &-title {
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      color: #ff2d4a;
      font-size: 30rpx;
    }
    &-edit {
      display: flex;
      justify-content: space-between;
      .outer {
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        border-radius: 5rpx;
        view {
          height: 50rpx;
          width: 50rpx;
          line-height: 50rpx;
          text-align: center;
        }
        .value {
          width: 65rpx;
          border-left: 1px solid #ddd;
        }
        .add {
          border-left: 1px solid #ddd;
        }
      }
    }
  }
}
.pubIcon {
  background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
    no-repeat 0 0;
  background-size: 300rpx 300rpx;
  width: 55rpx;
  height: 55rpx;
}
.trueIcon {
  background-position: 0 -225rpx;
}
.falseIcon {
  background-position: -50rpx -225rpx;
}
.fixed-bar {
  display: flex;
  height: 98rpx;
  width: 750rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .allselect {
    padding-left: @PADDING-LEFT;
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
  }
  .statistics {
    flex: 1;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .jiesuan {
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff2d4a;
    text {
      color: #fff;
    }
  }

  .disabled {
    background-color: #ddd;
  }
}
</style>
