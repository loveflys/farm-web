import config from '../utils/config.js';
import cookie from '../common/cookie.js';
module.exports = {
  // 数据调用请求.参数包括
  // callBack:回调函数
  // data:提交参数
  ajax: function (options) {
    $.ajax({
      url: config.SERVER_URL + options.api,
      beforeSend: function(request) {
        request.setRequestHeader("X-USERID", window.localStorage.getItem("X-USERID"));
        request.setRequestHeader("X-TOKEN",  window.localStorage.getItem("X-TOKEN"));
      },
      complete: function (xhr) {
        var msg = xhr.responseJSON;
        console.log('返回数据:');
        console.log(msg);
        if (msg.code === "800-888") {
          alert('身份信息过期，请重新访问应用');
          window.location.href="/login/index.html#!/";
        } else {
          options.callBack(msg);
        }
      },
      method: "post",
      xhrFields: {withCredentials: true},
      crossDomain: true,
      data: options.data,
      dataType: "JSON"
    });
  }
};
