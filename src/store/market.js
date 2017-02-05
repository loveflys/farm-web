import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取市场列表
  */
  getMarketList: function (param, callBack) {
    API.ajax({
      api: "market/list",
      callBack: callBack,
      data: param
    });
  },
};
