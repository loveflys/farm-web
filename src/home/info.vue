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
  import store from '../store/info.js';
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
              return `${row.title===1?"普通消息":"美食消息"}`;
            }
          },
          {
            title: '作者',
            key: 'authorName'
          },
          {
            title: '主图',
            key: 'mainImg',
            render (row, column, index) {
              return `<img src="${row.mainImg}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '点击数',
            key: 'viewNum'
          },
          {
            title: '评论数',
            key: 'commentNum'
          },
          {
            title: '创建时间',
            key: 'createTime',
            render (row, column, index) {
              return `${new Date(row.createTime).toLocaleString().replace(/\//g,"-")}`;
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
        store.getInfoList(param, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.data = msg.list;
          } else {
            this.$Message.error('获取信息列表失败!');
          }
        });
      },
      getTime (value) {
        if (!value) {
          return '';
        }
        const date = new Date(value);
        const year = date.getFullYear();
        let m = date.getMonth()+1;
        const month = m<10?'0'+m:m;
        const day = date.getDate()<10?'0'+date.getDate():date.getDate();
        const Hour = date.getHours()<10?'0'+date.getHours():date.getHours();
        const Minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        const Second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        return `${year}-${month}-${day} ${Hour}:${Minute}:${Second}`;
      }
    }
  }
</script>
