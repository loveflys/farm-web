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
    }, 'get');
  },
  /**
  * 删除市场
  */
  delMarket: function (param, callBack) {
    API.ajax({
      api: "market/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增市场
  */
  addMarket: function (param, callBack) {
    API.ajax({
      api: "market/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑市场
  */
  updateMarket: function (param, callBack) {
    API.ajax({
      api: "market/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取市场详情
  */
  getMarket: function (param, callBack) {
    API.ajax({
      api: "market/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
