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
    });
  },
};
