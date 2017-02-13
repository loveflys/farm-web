<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/ad/add')">新建</i-button>
  </Row>
  <i-col class="tabs-style" style="background: #e3e8ee;padding:16px;height: 100vh;">
    <Tabs type="card" :active-key.sync="tabkey">
      <Tab-pane key="all" label="所有">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="text" label="文字广告">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="img" label="图片广告">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
    </Tabs>
  </i-col>
</template>
<script>
  import store from '../store/ad.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        tabkey: 'all',
        type: '0', //1-图片 2-文字
        self: this,
        columns: [
          {
            title: '标题',
            key: 'title',
            render (row, column, index) {
              return `<strong>${row.title}</strong>`;
            }
          },
          {
            title: '类型',
            key: 'type',
            render (row, column, index) {
              return `${row.type===1?"图片广告":"文字广告"}`;
            }
          },
          {
            title: '展示方式',
            key: 'showType',
            render (row, column, index) {
              return `${row.showType===1?"永久展示":"时间区间"}`;
            }
          },
          {
            title: '响应类型',
            key: 'responseType',
            render (row, column, index) {
              return `${row.responseType===1?"无":(row.responseType===2?"超链接":"点击进入详情")}`;
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            render (row, column, index) {
              return `${new Date(row.createTime).toLocaleString().replace(/\//g,"-")}`;
            }
          },
          {
            title: '状态',
            key: 'pushed',
            render (row, column, index) {
              return `${row.deleted?"已删除":(row.pushed?'已推送':'未推送')}`;
            }
          },
          {
            title: '推送时间',
            key: 'pushTime',
            render (row, column, index) {
              return `${new Date(row.pushTime).toLocaleString().replace(/\//g,"-")}`;
            }
          },
          {
            title: '主图',
            key: 'img',
            render (row, column, index) {
              return `<img v-if="${row.type==1}" src="${row.img}" style="width:100px;height:100px;" />${row.type==2?"无":""}`;
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button v-if="${!row.deleted&&!row.pushed}" type="success" size="small" @click="push(${index}, 1)">推送</i-button> <i-button v-if="${!row.deleted&&row.pushed}" type="error" size="small" @click="push(${index},2)">取消推送</i-button> <i-button v-if="${!row.deleted}" type="error" size="small" @click="remove(${index})">删除</i-button>`;
            }
          }
        ],
        data: []
      }
    },
    watch : {
      tabkey () {
        switch(this.tabkey) {
          case "all":
            this.type = "0";
            break;
          case "img":
            this.type = "1";
            break;
          case "text":
            this.type = "2";
            break;
        }
        this.getData();
      },
      pageIndex () {
        this.getData();
      }
    },
    ready() {
      window.x = this;
      this.getData();
      //this.$nextTick(function () {
      //  this.$parent.$root.$data.activekey = "6-1";
      //});
    },
    methods: {
      getData () {
        let param = {
          title: this.key,
          type: this.type,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getAdList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取广告列表失败!');
          }
        });
      },
      remove (index) {
        let param = {
          id: this.data[index].id,
          deleted: 1
        }
        store.updateAd(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('删除广告成功!');
            this.getData();
          } else {
            this.$Message.error('删除广告失败!');
          }
        });
      },
      push (index, pushed) {
        let param = {
          id: this.data[index].id,
          pushed: pushed
        }
        store.updateAd(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('推送广告成功!');
            this.getData();
          } else {
            this.$Message.error('推送广告失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/ad/edit/"+this.data[index].id);
      },
    }
  }
</script>
