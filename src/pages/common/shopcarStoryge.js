/**
 * 主要对于购物车数据的增删改查
 */

const KEY  = 'GOODS'
/**
 * 获取本地数据
 */
export const getLocalStoryge =()=> {
    return wx.getStorageSync(KEY) || {}
}

/**
 * {goods_id: 129, goods_number: 1}
 * @param {*} goods 
 */

export const addGoods =goods=> {
    //从本地取出
    const localGoods = getLocalStoryge()
    //判读是否存在
    if(localGoods[goods.goods_id]) {
        localGoods[goods.goods_id]+= goods.goods_number
    }else {
        localGoods[goods.goods_id]= goods.goods_number
    }
    //存储到本地
    wx.setStorageSync(KEY,localGoods)
 
    
}
/**
 * 修改商品
 * {goods_id: 129, goods_number: 1}
 */
export const updataGoods = goods =>{
    //从本地调取
    
    const localGoods = getLocalStoryge()
    localGoods[goods.goods_id] = goods.goods_number
    
    //存储到本地中
    wx.setStorageSync(KEY,localGoods)
}

/**
 * 删除
 * goods_id
 */

 export const delGoods = goods_id =>{
     //从本地获取
     const localGoods = getLocalStoryge()

     //从本地删除
     delete localGoods[goods_id]

     //存储到本地
     wx.setStorageSync(KEY,localGoods)
 }