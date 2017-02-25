import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取反馈意见列表
  */
  getSuggestionList: function (param, callBack) {
    API.ajax({
      api: "suggestion/list",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 删除反馈意见
  */
  delSuggestion: function (param, callBack) {
    API.ajax({
      api: "suggestion/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取反馈意见详情
  */
  getSuggestion: function (param, callBack) {
    API.ajax({
      api: "suggestion/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
