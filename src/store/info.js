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
    }, 'get');
  },
  /**
  * 获取信息评论列表
  */
  getInfoCommentList: function (param, callBack) {
    API.ajax({
      api: "info/listcomment",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 删除信息
  */
  delInfo: function (param, callBack) {
    API.ajax({
      api: "info/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增信息
  */
  addInfo: function (param, callBack) {
    API.ajax({
      api: "info/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑信息
  */
  updateInfo: function (param, callBack) {
    API.ajax({
      api: "info/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取信息详情
  */
  getInfo: function (param, callBack) {
    API.ajax({
      api: "info/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
