export default {
    data() {
        return {
            address: null
        }
    },
    methods: {
        //选择收获地址
        chooseAddress() {
            wx.chooseAddress({
                success: res => {
                    res.detailAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
                    this.address = res
                    //保存到本地
                    wx.setStorageSync('address', res)
                },
                fail: res => {
                    if (res.errMsg == "chooseAddress:fail auth deny") {
                        wx.showModal({
                            title: '提示', //提示的标题,
                            content: '请打开收货地址', //提示的内容,
                            showCancel: false, //是否显示取消按钮,
                            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                            confirmColor: '#3CC51F', //确定按钮的文字颜色,
                            success: res => {
                                if (res.confirm) {
                                    wx.switchTab({ url: '/pages/mine/main' });
                                }
                            }
                        });
                    }

                }
            });
        },
    },
}