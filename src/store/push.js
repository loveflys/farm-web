import API from 'src/store/api.js';
module.exports = {
  /**
  * 消息推送
  */
  push: function (param, callBack) {
    API.ajax({
      api: "push",
      callBack: callBack,
      data: param
    },'get');
  },
};
