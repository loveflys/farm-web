import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取论坛列表
  */
  getBBSList: function (param, callBack) {
    API.ajax({
      api: "bbs/list",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取论坛评论列表
  */
  getBBSCommentList: function (param, callBack) {
    API.ajax({
      api: "bbs/listcomment",
      callBack: callBack,
      data: param
    });
  },
};
