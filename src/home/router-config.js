
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
    '/address/list': {
      component (resolve) {
        require(['./address'], resolve);
      }
    },
    '/address/add': {
      component (resolve) {
        require(['./addaddress'], resolve);
      }
    },
    '/address/edit/:id': {
      component (resolve) {
        require(['./editaddress'], resolve);
      }
    },
    '/ad/list': {
      component (resolve) {
        require(['./ad'], resolve);
      }
    },
    '/ad/add': {
      component (resolve) {
        require(['./addad'], resolve);
      }
    },
    '/ad/edit/:id': {
      component (resolve) {
        require(['./editad'], resolve);
      }
    },
    '/info/list': {
      component (resolve) {
        require(['./info'], resolve);
      }
    },
    '/info/add': {
      component (resolve) {
        require(['./addinfo'], resolve);
      }
    },
    '/info/edit/:id': {
      component (resolve) {
        require(['./editinfo'], resolve);
      }
    },
    '/market/list': {
      component (resolve) {
        require(['./market'], resolve);
      }
    },
    '/market/add': {
      component (resolve) {
        require(['./addmarket'], resolve);
      }
    },
    '/market/edit/:id': {
      component (resolve) {
        require(['./editmarket'], resolve);
      }
    },
    '/manager/list': {
      component (resolve) {
        require(['./manager'], resolve);
      }
    },
    '/manager/add': {
      component (resolve) {
        require(['./addmanager'], resolve);
      }
    },
    '/manager/edit/:id': {
      component (resolve) {
        require(['./editmanager'], resolve);
      }
    },
    '/user/list': {
      component (resolve) {
        require(['./user'], resolve);
      }
    },
    '/user/add': {
      component (resolve) {
        require(['./adduser'], resolve);
      }
    },
    '/user/edit/:id': {
      component (resolve) {
        require(['./edituser'], resolve);
      }
    },
    '/class/list': {
      component (resolve) {
        require(['./class'], resolve);
      }
    },
    '/class/add': {
      component (resolve) {
        require(['./addclass'], resolve);
      }
    },
    '/class/edit/:id': {
      component (resolve) {
        require(['./editclass'], resolve);
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
    '/product/list': {
      component (resolve) {
        require(['./product'], resolve);
      }
    },
    '/recipes/list': {
      component (resolve) {
        require(['./recipes'], resolve);
      }
    },
    '/recipes/add': {
      component (resolve) {
        require(['./addrecipes'], resolve);
      }
    },
    '/recipes/edit/:id': {
      component (resolve) {
        require(['./editrecipes'], resolve);
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
