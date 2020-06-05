<template>
    <div>
        <button open-type="openSetting">打开授权</button>
        <button @click="getUserLocation">获取用户定位</button>
    </div>
</template>

<script>
export default {
    methods: {
        // 授权按钮
        openSetting(){

        },
        //定位
        getUserLocation(){
            wx.getLocation({
              type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
              success: res => {
                console.log(res);
                
              },
              fail: () => {
                console.log("getLocation failed")
              }
            });
        }
    },
}
</script>

<style>

</style>
