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
                    陈安一
                </template>
                <Menu-group title="设置">
                    <Menu-item key="3-1">新增和启动</Menu-item>
                    <Menu-item key="3-2">活跃分析</Menu-item>
                    <Menu-item key="3-3">退出</Menu-item>
                </Menu-group>
            </Submenu>
          </Menu>
        </i-col>
    </Row>
    <Row>
      <i-col span="4">
        <Menu theme="dark">
          <Menu-item key="1">
            <Icon type="ios-people"></Icon>
            首页
          </Menu-item>
          <Submenu key="2">
            <template slot="title">
              <Icon type="ios-people"></Icon>
              农产品分类
            </template>
            <Menu-item key="2-1">列表管理</Menu-item>
            <Menu-item key="2-2">新建</Menu-item>
          </Submenu>
          <Menu-item key="3">
            <Icon type="ios-people"></Icon>
            地址管理
          </Menu-item>
          <Menu-item key="4">
            <Icon type="ios-people"></Icon>
            信息管理
          </Menu-item>
          <Menu-item key="5">
            <Icon type="ios-people"></Icon>
            广告管理
          </Menu-item>
          <Menu-item key="6">
            <Icon type="ios-people"></Icon>
            市场管理
          </Menu-item>
          <Submenu key="7">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              用户管理
            </template>
            <Menu-item key="7-1">用户管理</Menu-item>
            <Menu-item key="7-2">商户管理</Menu-item>
            <Menu-item key="7-3">信息评论管理</Menu-item>
            <Menu-group title="论坛管理">
              <Menu-item key="7-4">论坛帖子管理</Menu-item>
              <Menu-item key="7-5">论坛评论管理</Menu-item>
            </Menu-group>
          </Submenu>
          <Menu-item key="8">
            <Icon type="ios-people"></Icon>
            食谱管理
          </Menu-item>
          <Menu-item key="9">
            <Icon type="ios-people"></Icon>
            农产品管理
          </Menu-item>
        </Menu>
      </i-col>
      <i-col span="20">
        <router-view v-ref:main class="login-container"></router-view>
      </i-col>
    </Row>
</template>
