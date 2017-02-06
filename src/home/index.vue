<template>
    <Row>
        <i-col span="24">
          <Menu mode="horizontal" theme="dark">
            <Menu-item>
                <Icon type="ios-paper"></Icon>
                没起好名管理后台
            </Menu-item>
            <Submenu style="float:right">
                <template slot="title">
                    <Icon type="stats-bars"></Icon>
                    {{name}}
                </template>
                <Menu-group title="设置">
                    <Menu-item key="0-1" @click="logout()">退出</Menu-item>
                </Menu-group>
            </Submenu>
          </Menu>
        </i-col>
    </Row>
    <Row>
      <i-col span="4">
        <Menu theme="dark">
          <Menu-item key="1" @click="this.$router.go('/')">
            <Icon type="ios-people"></Icon>
            首页
          </Menu-item>
          <Submenu key="2">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              农产品管理
            </template>
            <Menu-item key="2-1" @click="this.$router.go('/product')">农产品管理</Menu-item>
            <Menu-item key="2-2" @click="this.$router.go('/class')">农产品分类</Menu-item>
          </Submenu>
          <Menu-item key="3" @click="this.$router.go('/address')">
            <Icon type="ios-people"></Icon>
            地址管理
          </Menu-item>
          <Submenu key="4">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              信息管理
            </template>
            <Menu-item key="4-1" @click="this.$router.go('/info')">信息管理</Menu-item>
            <Menu-item key="4-2" @click="this.$router.go('/infocomment')">信息评论管理</Menu-item>
          </Submenu>
          <Submenu key="5">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              论坛管理
            </template>
            <Menu-item key="5-1" @click="this.$router.go('/bbs')">论坛帖子管理</Menu-item>
            <Menu-item key="5-2" @click="this.$router.go('/bbscomment')">论坛评论管理</Menu-item>
          </Submenu>
          <Menu-item key="6" @click="this.$router.go('/ad')">
            <Icon type="ios-people"></Icon>
            广告管理
          </Menu-item>
          <Menu-item key="7" @click="this.$router.go('/market')">
            <Icon type="ios-people"></Icon>
            市场管理
          </Menu-item>
          <Submenu key="8">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              用户管理
            </template>
            <Menu-item key="8-1" @click="this.$router.go('/user')">用户管理</Menu-item>
            <Menu-item key="8-2" @click="this.$router.go('/manager')">商户管理</Menu-item>
          </Submenu>
          <Menu-item key="8" @click="this.$router.go('/recipers')">
            <Icon type="ios-people"></Icon>
            食谱管理
          </Menu-item>
        </Menu>
      </i-col>
      <i-col span="20">
        <router-view v-ref:main class="login-container"></router-view>
      </i-col>
    </Row>
</template>
<script>
  import store from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        name: '',
        avatar: ''
      }
    },
    ready() {
      this.name = window.localStorage.getItem("user-name");
    },
    methods: {
      logout () {
        let param = {

        }
        store.logout(param, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            window.localStorage.clear();
            this.$Message.success('退出登录成功!');
            window.location.href="/login/index.html#!/";
          } else {
            this.$Message.error('退出登录失败!');
          }
        });
      }
    }
  }
</script>
