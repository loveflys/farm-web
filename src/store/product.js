import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取商品列表
  */
  getProductList: function (param, callBack) {
    API.ajax({
      api: "pro/list",
      callBack: callBack,
      data: param
    });
  },
};
