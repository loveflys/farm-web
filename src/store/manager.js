import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取管理员列表
  */
  getManagerList: function (param, callBack) {
    API.ajax({
      api: "manager/list",
      callBack: callBack,
      data: param
    });
  },
};
