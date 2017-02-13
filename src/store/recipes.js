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
    },'get');
  },
  /**
  * 审核食谱帖子
  */
  checkRecipes: function (param, callBack) {
    API.ajax({
      api: "recipes/check",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 删除食谱帖子
  */
  delRecipes: function (param, callBack) {
    API.ajax({
      api: "recipes/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增食谱帖子
  */
  addRecipes: function (param, callBack) {
    API.ajax({
      api: "recipes/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑食谱帖子
  */
  updateRecipes: function (param, callBack) {
    API.ajax({
      api: "recipes/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取食谱帖子详情
  */
  getRecipes: function (param, callBack) {
    API.ajax({
      api: "recipes/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
