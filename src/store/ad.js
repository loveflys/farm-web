import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取广告列表
  */
  getAdList: function (param, callBack) {
    API.ajax({
      api: "ad/list",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 删除广告
  */
  delAd: function (param, callBack) {
    API.ajax({
      api: "ad/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增广告
  */
  addAd: function (param, callBack) {
    API.ajax({
      api: "ad/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑广告
  */
  updateAd: function (param, callBack) {
    API.ajax({
      api: "ad/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取广告详情
  */
  getAd: function (param, callBack) {
    API.ajax({
      api: "ad/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
