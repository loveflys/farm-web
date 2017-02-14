<style>
      div{
          width:100%;
      }
</style>
<template>
  <script id="editor" type="text/plain" style="width:1024px;height:500px;"></script>
</template>
<script>
  import ueconfig from '../../public/ueditor/ueditor.config.js';
  import all from '../../public/ueditor/ueditor.all.min.js';
  import zhcn from '../../public/ueditor/lang/zh-cn/zh-cn.js';
  import store from '../store/login.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {

      }
    },
    ready() {
      window.x = this;
      var ue = UE.getEditor('editor');
    },
    methods: {

    }
  }
</script>
