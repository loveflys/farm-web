import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取分类列表
  */
  getClassList: function (param, callBack) {
    API.ajax({
      api: "class/list",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 删除分类
  */
  delClass: function (param, callBack) {
    API.ajax({
      api: "class/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增分类
  */
  addClass: function (param, callBack) {
    API.ajax({
      api: "class/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑分类
  */
  updateClass: function (param, callBack) {
    API.ajax({
      api: "class/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取分类详情
  */
  getClass: function (param, callBack) {
    API.ajax({
      api: "class/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
