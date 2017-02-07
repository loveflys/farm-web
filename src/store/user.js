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
  /**
  * 删除用户
  */
  delUser: function (param, callBack) {
    API.ajax({
      api: "user/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增用户
  */
  addUser: function (param, callBack) {
    API.ajax({
      api: "user/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑用户
  */
  updateUser: function (param, callBack) {
    API.ajax({
      api: "user/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取用户详情
  */
  getUser: function (param, callBack) {
    API.ajax({
      api: "user/get",
      callBack: callBack,
      data: param
    });
  }
};
