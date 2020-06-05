<template>
  <div class="categories">
    <!-- 左侧目录 -->
    <scroll-view :style="{height:windowHeight +'px;'}" class="categories-left" scroll-y>
      <div
        v-for="(item,index) in categoriesList"
        :key="index"
        :class='["categories-left-item",index == selectIndex?"categories-left-active":""]'
        @click="changeIndex(index)"
      >
        <text>{{item.cat_name}}</text>
      </div>
    </scroll-view>
    <scroll-view :style="{height:windowHeight +'px;'}" class="categories-right" scroll-y>
       
        <div class="categories-right-item" v-for="(item2,index2) in secondLevelCategories" :key="index2">
             <!-- 第二级标题 -->
            <div class="categories-right-item-title">
                {{item2.cat_name}}
            </div>
             <!-- 第二级图片 -->
            <div class="categories-right-item-body">
                <div class="right-body-item" v-for="(subitem,index3) in item2.children" :key="index3">
                    <image :src="subitem.cat_icon" />
                    <div class="right-body-item-title">{{subitem.cat_name}}</div>
                </div>
            </div>
        </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoriesList: [],
      selectIndex: 0,
      secondLevelCategories:[],
      windowHeight:0
    };
  },
  onLoad() {
    //加载分类数据
    this.getCategories();
     const {windowHeight} = wx.getSystemInfoSync()
    this.windowHeight = windowHeight - 10
  },
  methods: {
    //获取分类数据
    async getCategories() {
      let res = await this.$https.get("categories");
      this.categoriesList = res.data.message;
      
      //加载第二级
    this.secondLevelCategories = this.categoriesList[0].children
    },
    changeIndex(index) {
      this.selectIndex = index;
        //一级赋值第二级
    this.secondLevelCategories = this.categoriesList[index].children
    }
  }
};
</script>

<style lang="less" scoped>
.categories {
  display: flex;
  margin-top: 10px;
  &-left {
    width: 200rpx;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background-color: #f4f4f4;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 100rpx;
      position: relative;
      text {
        color: #999;
      }
    }
    &-active {
      background: #fff;
      text {
        color: #000;
      }
      &::before {
        position: absolute;
        content: "";
        background-color: #ff2d4a;
        left: 0;
        top: 10rpx;
        width: 5px;
        height: 80rpx;
      }
    }
  }
  &-right {
    flex: 1;
    background-color: #fff;
    &-item {
      &-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        font-size: 14px;
        &::before {
          content: "/";
          color: #eeeeee;
          margin-right: 20rpx;
        }

        &::after {
          content: "/";
          color: #eeeeee;
          margin-left: 20rpx;
        }
      }
      &-body {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
image {
  width: 100rpx;
  height: 80rpx;
}
.right-body-item {
  height: 200rpx;
  width: 33.33333%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-title {
    margin-top: 5rpx;
    color: #666;
    font-size: 14px;
  }
}
</style>
