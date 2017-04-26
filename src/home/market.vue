<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/market/add')">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/market.js';
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
              return `<strong>${row.name}</strong>`;
            }
          },
          {
            title: '地址',
            key: 'locationName'
          },
          {
            title: '店铺图',
            key: 'imgs',
            render (row, column, index) {
              return `<img src="${row.imgs[0]}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '介绍',
            key: 'descr'
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
      pageIndex () {
        this.getData();
      }
    },
    ready() {
      window.x = this;
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "7-1";
      });
    },
    methods: {
      getData () {
        let param = {
          name: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getMarketList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取市场列表失败!');
          }
        });
      },
      remove (index) {
        this.$Modal.confirm({
            title: '提示',
            content: '是否删除该市场',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
              let param = {
                id: this.data[index].id
              }
              store.delMarket(param, (msg)=> {
                if (msg.code === '0') {
                  this.$Message.info('删除成功!');
                  this.data.splice(index, 1);
                } else {
                  this.$Message.error('删除市场失败!');
                }
              });
            },
            onCancel: () => {

            }
        });
      },
      edit (index) {
        this.$router.go("/market/edit/"+this.data[index].id);
      }
    }
  }
</script>
