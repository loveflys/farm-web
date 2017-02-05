import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取信息列表
  */
  getInfoList: function (param, callBack) {
    API.ajax({
      api: "info/list",
      callBack: callBack,
      data: param
    });
  },
};
