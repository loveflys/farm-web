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
  import store from '../store/manager.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
        self: this,
        columns: [
          {
            title: '类型',
            key: 'divisionCode',
            render (row, column, index) {
              return `${row.type===2?"超级管理员":"管理员"}`;
            }
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '手机号码',
            key: 'phone'
          },
          {
            title: 'id',
            key: 'id'
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
          name: this.key,
          pagenum: 1,
          pagesize: 10
        }
        store.getManagerList(param, (msg)=> {
          console.log(JSON.stringify(msg));
          if (msg.code === '0') {
            this.data = msg.lists;
          } else {
            this.$Message.error('获取管理员列表失败!');
          }
        });
      }
    }
  }
</script>
