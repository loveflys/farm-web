<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
</template>
<script>
  import store from '../store/ad.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
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
            title: '推送状态',
            key: 'pushed',
            render (row, column, index) {
              return `${row.pushed?'已推送':'未推送'}`;
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
              return `<img src="${row.img}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
            }
          }
        ],
        data: []
      }
    },
    watch : {
      key () {
        //this.getData();
      }
    },
    ready() {
      window.x = this;
      this.getData();
    },
    methods: {
      getData () {
        let param = {
          title: this.key,
          pagenum: 1,
          pagesize: 10
        }
        store.getAdList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
          } else {
            this.$Message.error('获取广告列表失败!');
          }
        });
      }
    }
  }
</script>
