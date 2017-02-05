import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取地址列表
  */
  getAddrList: function (param, callBack) {
    API.ajax({
      api: "division/list",
      callBack: callBack,
      data: param
    });
  },
};
