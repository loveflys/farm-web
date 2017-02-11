import API from 'src/store/api.js';
module.exports = {
  /**
  * 获取地址列表
  */
  getAddrList: function (param, callBack) {
    API.ajax({
      api: "division/list",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 删除地址
  */
  delAddr: function (param, callBack) {
    API.ajax({
      api: "division/del",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 新增地址
  */
  addAddr: function (param, callBack) {
    API.ajax({
      api: "division/add",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 编辑地址
  */
  updateAddr: function (param, callBack) {
    API.ajax({
      api: "division/update",
      callBack: callBack,
      data: param
    });
  },
  /**
  * 获取地址详情
  */
  getAddr: function (param, callBack) {
    API.ajax({
      api: "division/get",
      callBack: callBack,
      data: param
    }, 'get');
  },
  /**
  * 获取地址详情
  */
  getAddrByCode: function (param, callBack) {
    API.ajax({
      api: "division/getbycode",
      callBack: callBack,
      data: param
    }, 'get');
  }
};
