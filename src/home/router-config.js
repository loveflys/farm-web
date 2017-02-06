
export default function (router) {
  router.map({
    '/': {
      component (resolve) {
        require(['./home'], resolve);
      }
    },
    '/home': {
      component (resolve) {
        require(['./home'], resolve);
      }
    },
    '/address': {
      component (resolve) {
        require(['./address'], resolve);
      }
    },
    '/ad': {
      component (resolve) {
        require(['./ad'], resolve);
      }
    },
    '/info': {
      component (resolve) {
        require(['./info'], resolve);
      }
    },
    '/market': {
      component (resolve) {
        require(['./market'], resolve);
      }
    },
    '/manager': {
      component (resolve) {
        require(['./manager'], resolve);
      }
    },
    '/user': {
      component (resolve) {
        require(['./user'], resolve);
      }
    },
    '/class': {
      component (resolve) {
        require(['./class'], resolve);
      }
    },
    '/bbs': {
      component (resolve) {
        require(['./bbs'], resolve);
      }
    },
    '/bbscomment': {
      component (resolve) {
        require(['./bbscomment'], resolve);
      }
    },
    '/infocomment': {
      component (resolve) {
        require(['./infocomment'], resolve);
      }
    },
    '/product': {
      component (resolve) {
        require(['./product'], resolve);
      }
    },
    '/recipers': {
      component (resolve) {
        require(['./recipes'], resolve);
      }
    }
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
