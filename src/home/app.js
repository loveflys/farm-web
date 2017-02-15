import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterConfig from './router-config';
import Sortable from 'vue-sortable'
import iView from 'iview';
import wangEditor from 'wangeditor';
import 'iview/dist/styles/iview.css';    // 使用 CSS


Vue.use(Sortable)
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(wangEditor);
/* eslint-disable no-new */
const router = new VueRouter({});
RouterConfig(router);
window._router = router;
var App = Vue.extend(require('./index'));
router.start(App, '.container');

Vue.filter('date', (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const year = date.getFullYear();
  let m = date.getMonth()+1;
  const month = m<10?'0'+m:m;
  const day = date.getDate()<10?'0'+date.getDate():date.getDate();
  const hour = date.getHours(); //获取当前小时数(0-23)
  const minute = date.getMinutes();
  return `${year}-${month}-${day} ${hour}:${minute}`;
});
