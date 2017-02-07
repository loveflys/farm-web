<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/address/add')">新建</i-button>
  </Row>


  <i-table style="margin:20px 0;" border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/address.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        self: this,
        columns: [
          {
            title: '完整名称',
            key: 'completeName',
            render (row, column, index) {
              return `<strong>${row.completeName}</strong>`;
            }
          },
          {
            title: '区划编号',
            key: 'divisionCode'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '地址id',
            key: 'id'
          },
          {
            title: '地址等级',
            key: 'level',
            render (row, column, index) {
              return `${row.level===1?"省":(row.level===2?"市":"区/县")}`;
            }
          },
          {
            title: '父级地址',
            key: 'parentId'
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
      pageIndex () {
        this.getData();
      }
    },
    ready() {
      window.x = this;

      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "3-1";
      });
      this.getData();
    },
    methods: {
      getData () {
        let param = {
          name: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getAddrList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取地址列表失败!');
          }
        });
      },
      remove (index) {
        let param = {
          id: this.data[index].id
        }
        store.delAddr(param, (msg)=> {
          if (msg.code === '0') {
            this.data.splice(index, 1);
          } else {
            this.$Message.error('删除地址失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/address/edit/"+this.data[index].id);
      }
    }
  }
</script>
