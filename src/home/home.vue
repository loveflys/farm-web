<style scoped>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
    .ivu-timeline-item-head-custom {
      font-size: 24px !important;
    }
</style>

<template>
  <Timeline style="margin-top:20px;">
      <Timeline-item>
          <Icon size="24" type="ios-personadd" slot="dot"></Icon>
          <span>今日新增用户</span>
          <p class="content">{{newCount}}</p>
      </Timeline-item>
      <Timeline-item>
          <Icon size="24" type="ios-people" slot="dot"></Icon>
          <span>总用户数</span>
          <p class="content">{{totalCount}}</p>
      </Timeline-item>
  </Timeline>
</template>
<script>
  import store from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        totalCount: 0,
        newCount: 0,
      }
    },
    ready() {
      window.x = this;
      this.getData();
    },
    methods: {
      test (url, param) {
        store.Test(url, param, (res)=> {
          
        });
      },
      getData () {
        let now = new Date();
        let start = new Date(now.getFullYear()+'/'+(now.getMonth()+1) + '/' + now.getDate()).getTime();
        let end = new Date(now.getFullYear()+'/'+(now.getMonth()+1) + '/' + (now.getDate()+1)).getTime();
        let param = {
          pagenum: 1,
          pagesize: 1,
          paged: 1,
          startDate: start,
          endDate: end
        }
        store.getUserList(param, (msg)=> {
          if (msg.code === '0') {
            this.newCount = msg.totalCount;
          } else {
            this.$Message.error('获取用户列表失败!');
          }
        });

        param.startDate = 0;
        param.endDate = 0;
        store.getUserList(param, (msg)=> {
          if (msg.code === '0') {
            this.totalCount = msg.totalCount;
          } else {
            this.$Message.error('获取用户列表失败!');
          }
        });
      },
    }
  }
</script>
