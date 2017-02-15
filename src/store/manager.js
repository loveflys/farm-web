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
    }, 'get');
  },
  /**
  * 删除管理员
  */
  delManager: function (param, callBack) {
    API.ajax({
      api: "manager/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增管理员
  */
  addManager: function (param, callBack) {
    API.ajax({
      api: "manager/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑管理员
  */
  updateManager: function (param, callBack) {
    API.ajax({
      api: "manager/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取管理员详情
  */
  getManager: function (param, callBack) {
    API.ajax({
      api: "manager/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
