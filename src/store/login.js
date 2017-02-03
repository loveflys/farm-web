import API from 'src/store/api.js';
module.exports = {
  /**
  * 创建计划
  */
  login: function (param, callBack) {
    API.ajax({
      api: "manager/login",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 修改计划
  */
  update: function (param, callBack) {
    API.ajax({
      api: "live/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取当前用户的社群列表
  */
  getLiveList: function (pageSize, pageNum, orderBy, orderFlag, callBack) {
    API.ajax({
      api: "live/list",
      callBack: callBack,
      data: {
        orderBy: orderBy,
        orderFlag: orderFlag,
        pageNum: pageNum,
        pageSize: pageSize
      }
    });
  },
  /**
  * 社群直播计划详情查询
  */
  getLiveInfo: function (id, callBack) {
    API.ajax({
      api: "live/get",
      callBack: callBack,
      data: {
        id: id
      }
    });
  },
    /**
  * 社群直播开启问答模式
  */
  getQaInfo: function (status, callBack) {
    API.ajax({
      api: "live/qa",
      callBack: callBack,
      data: {
        status: status
      }
    });
  },
  // 开启qa
  interaction: function (id, status, callBack) {
    API.ajax({
      api: "live/interaction",
      callBack: callBack,
      data: {
        id,
        status
      }
    });
  },
    // 开启群直播
  startorstop: function (id, status, callBack) {
    API.ajax({
      api: "live/startorstop",
      callBack: callBack,
      data: {
        id,
        status
      }
    });
  },
  // 查询精华稿 http://wiki.huntor.cn:8090/pages/viewpage.action?pageId=22315450
  getRecords: function (param, callBack) {
    API.ajax({
      api: "live/records",
      callBack: callBack,
      data: param
    });
  },
    // 设置消息为精华 http://wiki.huntor.cn:8090/pages/viewpage.action?pageId=22315437
  setRecords: function (param, callBack) {
    API.ajax({
      api: "live/setrecords",
      callBack: callBack,
      data: param
    });
  },
      // 排序 http://wiki.huntor.cn:8090/pages/viewpage.action?pageId=22315439&src=contextnavpagetreemode
  orderbyrecords: function (param, callBack) {
    API.ajax({
      api: "live/orderbyrecords",
      callBack: callBack,
      data: param
    });
  }
};
