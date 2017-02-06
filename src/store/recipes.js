import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取食谱列表
  */
  getRecipesList: function (param, callBack) {
    API.ajax({
      api: "recipes/list",
      callBack: callBack,
      data: param
    });
  },
};
