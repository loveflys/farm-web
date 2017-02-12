import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取论坛帖子列表
  */
  getBBSList: function (param, callBack) {
    API.ajax({
      api: "bbs/list",
      callBack: callBack,
      data: param
    },'get');
  },
  /**
  * 审核论坛帖子
  */
  checkBBS: function (param, callBack) {
    API.ajax({
      api: "bbs/check",
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
    },'get');
  },
  /**
  * 删除评论
  */
  updateBBSCommentList: function (param, callBack) {
    API.ajax({
      api: "bbs/updatecomment",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 删除论坛帖子
  */
  delBBS: function (param, callBack) {
    API.ajax({
      api: "bbs/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增论坛帖子
  */
  addBBS: function (param, callBack) {
    API.ajax({
      api: "bbs/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑论坛帖子
  */
  updateBBS: function (param, callBack) {
    API.ajax({
      api: "bbs/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取论坛帖子详情
  */
  getBBS: function (param, callBack) {
    API.ajax({
      api: "bbs/get",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
