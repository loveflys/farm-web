<style >
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .top,.bottom{
        text-align: center;
    }
    .center{
        width: 300px;
        margin: 10px auto;
        overflow: hidden;
        white-space: normal;
    }
    .center-left{
        float: left;
    }
    .center-right{
        float: right;
    }
    .ivu-tooltip-inner{
        max-width: none !important;
    }
    .tabs-style > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .tabs-style > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
        height: 100vh;
    }

    .tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
    }

    .tabs-style > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        border-color: #fff;
    }
    .ivu-tabs {
      height: 100vh;
    }
    .ivu-page {
      margin-top: 20px;
    }
</style>
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
        <Menu theme="dark" :active-key="activekey" accordion>
          <Menu-item key="1" @click="this.$router.go('/')">
            <Icon type="ios-people"></Icon>
            首页
          </Menu-item>
          <Submenu key="2">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              农产品管理
            </template>
            <Menu-group title="农产品管理">
              <Menu-item key="2-1" @click="this.$router.go('/product/list')">农产品列表</Menu-item>
            </Menu-group>
            <Menu-group title="农产品分类">
              <Menu-item key="2-2" @click="this.$router.go('/class/list')">农产品分类列表</Menu-item>
              <Menu-item key="2-3" @click="this.$router.go('/class/add')">新建农产品分类</Menu-item>
            </Menu-group>
          </Submenu>
          <Submenu key="3">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              区划管理
            </template>
            <Menu-item key="3-1" @click="this.$router.go('/address/list')">区划列表</Menu-item>
            <Menu-item key="3-2" @click="this.$router.go('/address/add')">新建区划</Menu-item>
          </Submenu>
          <Submenu key="4">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              信息管理
            </template>
            <Menu-group title="信息管理">
              <Menu-item key="4-1" @click="this.$router.go('/info/list')">信息列表</Menu-item>
              <Menu-item key="4-2" @click="this.$router.go('/info/add')">新建信息</Menu-item>
            </Menu-group>
            <Menu-group title="信息评论管理">
            <Menu-item key="4-3" @click="this.$router.go('/infocomment')">信息评论管理</Menu-item>
            </Menu-group>
          </Submenu>
          <Submenu key="5">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              论坛管理
            </template>
            <Menu-item key="5-1" @click="this.$router.go('/bbs')">论坛帖子管理</Menu-item>
            <Menu-item key="5-2" @click="this.$router.go('/bbscomment')">论坛评论管理</Menu-item>
          </Submenu>
          <Submenu key="6">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              广告管理
            </template>
            <Menu-item key="6-1" @click="this.$router.go('/ad/list')">广告列表</Menu-item>
            <Menu-item key="6-2" @click="this.$router.go('/ad/add')">新建广告</Menu-item>
          </Submenu>
          <Submenu key="7">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              市场管理
            </template>
            <Menu-item key="7-1" @click="this.$router.go('/market/list')">市场列表</Menu-item>
            <Menu-item key="7-2" @click="this.$router.go('/market/add')">新建市场</Menu-item>
          </Submenu>
          <Submenu key="8">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              用户管理
            </template>
            <Menu-group title="用户管理">
              <Menu-item key="8-1" @click="this.$router.go('/user/list')">用户列表</Menu-item>
              <Menu-item key="8-2" @click="this.$router.go('/user/add')">新建用户</Menu-item>
            </Menu-group>
            <Menu-group title="管理员管理">
              <Menu-item key="8-3" @click="this.$router.go('/manager/list')">管理员列表</Menu-item>
              <Menu-item key="8-4" @click="this.$router.go('/manager/add')">新建管理员</Menu-item>
            </Menu-group>
          </Submenu>
          <Submenu key="9">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              食谱管理
            </template>
            <Menu-item key="9-1" @click="this.$router.go('/recipes/list')">食谱列表</Menu-item>
            <Menu-item key="9-2" @click="this.$router.go('/recipes/add')">新建食谱</Menu-item>
          </Submenu>
        </Menu>
      </i-col>
      <i-col span="20">
        <router-view v-ref:main class="login-container"></router-view>
      </i-col>
    </Row>
</template>
<script>
  import '../assets/css/weui.css';
  import store from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        name: '',
        avatar: '',
        activekey: '1'
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
