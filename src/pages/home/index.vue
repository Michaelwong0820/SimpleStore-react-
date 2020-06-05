<template>
  <div>
    <!-- 轮播图 -->
  <swiper indicator-dots autoplay circular>
      <block v-for="(item,index) in swiperList" :key="index">
        <navigator :url="item.navigator_url" >
          <swiper-item>
              <image  :src="item.image_src"></image>
          </swiper-item>
      </navigator>
      </block>
  </swiper>
  <!--  分类图标-->
      <div class="categories">
        <div class="category-item" v-for="(item,index) in catitems" :key="index">
          <image :src="item.image_src"></image>
        </div>
      </div>
    <!-- 楼层数据 -->
    <div>
      
      <div v-for="(item,index) in floordata" :key="index" class="floor">
        <!-- 头部 --> 
        <div class="floor-head">
          <image :src="item.floor_title.image_src"></image>
        </div>
        <!-- 身体 -->
        <div class="floor-body">
          <!-- 左边 -->
          <div class="floor-body-left">
            <image :src="item.product_list[0].image_src"></image>
          </div>
          <!-- 右边 -->
          <div class="floor-body-right">
            <div v-if="index2>0"  v-for="(item2,index2) in item.product_list" :style="{width:item2.image_width + 'rpx'}"  :key="index2" class="floor-body-right-img" >
                  <image  style="width:100%;height:100%" :src="item2.image_src" ></image>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    <!-- 底部提醒 -->
    <div class="end-tips">
      <i class="iconfont .icon-xiao"></i>
      <span class="bottomline">已经到底了</span>
    </div>
    <!-- 置顶功能 -->
    <div v-show="toTop">
      <div class="to-top" @click="goToTop">
      <image src="/static/img/arrow_top@2x.png"></image>
      <text>顶部</text>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        swiperList:[],
        catitems:[],
        floordata:[],
        toTop:false
    };
  },
  onLoad() {
    //加载轮播图
    this.getSwiper()
    //加载分类数据
    this.getCatitems()
    //加载楼层数据
    this.getFloordata()
  },
  // 监听页面滚动
  onPageScroll ({scrollTop}) {
    if (scrollTop>80) {
      if(this.toTop) return
      this.toTop = true
    }else {
      if(!this.toTop) return
      this.toTop = false
    }
    
  },
  methods: {
    //获取轮播图资源
    async getSwiper() {
      let res = await this.$https.get("home/swiperdata")
      this.swiperList = res.data.message
    },
    //获取分类 数据
    async getCatitems() {
      let res = await this.$https.get('home/catitems')
      this.catitems = res.data.message
      
    },
    //获取楼层数据
    async getFloordata() {
      let res = await this.$https.get('home/floordata')
      this.floordata = res.data.message
    },
    //置顶
    goToTop() {
      mpvue.pageScrollTo({
        scrollTop:0,
        duration:300
      })
    }
  }
};
</script>

<style lang="less" scoped>
  swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:100%;
    height: 100%;
  }
}
.categories {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  height: 150rpx;
  .category-item {
    width: 120rpx;
    height: 120rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.floor {
  margin-top: 20rpx;
  background-color: white;
  &-head {
    width: 750rpx;
    height: 59rpx;
    image {
      margin: 10rpx 0rpx 0rpx 10rpx;
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    display: flex;
    padding: 20rpx 16rpx 10rpx 16rpx;
    &-left {
      width: 232rpx;
      height: 386rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      &-img {
        height: 188rpx;
        margin: 0 0 10rpx 10rpx;
      }
    }
  }
}
.end-tips {
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
  .bottomline {
    margin-left: 5rpx;
  }
}
.to-top {
  width: 90rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  image {
    width: 24rpx;
    height: 14rpx;
  }
  text {
    margin-top: 20rpx;
    color: #999;
    font-size: 12px;
  }
}
</style>
