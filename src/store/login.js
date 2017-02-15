import API from 'src/store/api.js';
module.exports = {
  /**
  * 创建计划
  */
  login: function (param, callBack) {
    API.ajax({
      api: "manager/login",
      callBack: callBack,
      data: param
    });
  }
};
