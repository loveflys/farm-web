
export default function (router) {
  router.map({
    '/': {
      component (resolve) {
        require(['./login'], resolve);
      }
    },
    '/login': {
      component (resolve) {
        require(['./login'], resolve);
      }
    },
  });
  // router.beforeEach(function (transition) {
  //   transition.next();
  //   document.title = transition.to.title;
  // });
  // router.afterEach(function (transition) {
  //   $("title").html(transition.to.title);
  //   var $body = $('body');
  //   var $iframe = $('<iframe src="/favicon.ico" width="0" height="0" style="display:none;"></iframe>').on('load', function () {
  //     setTimeout(function () {
  //       $iframe.off('load').remove();
  //     }, 0);
  //   }).appendTo($body);
  // });
}
