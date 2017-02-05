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
    });
  },
};
