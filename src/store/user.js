import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取用户列表
  */
  getUserList: function (param, callBack) {
    API.ajax({
      api: "user/list",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 退出登录
  */
  logout: function (param, callBack) {
    API.ajax({
      api: "user/logout",
      callBack: callBack,
      data: param
    });
  },
};
