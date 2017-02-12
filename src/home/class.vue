<style >
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
    .ivu-page {
      margin-top: 20px;
    }
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/class/add')">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/class.js';
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
            title: '编号',
            key: 'code'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '描述',
            key: 'descr',
            render (row, column, index) {
              return `<Tooltip placement="top">${row.descr.substr(0,10)+(row.descr.length>10?"...":"")}<div slot="content"><p>${row.descr}</p></div></Tooltip>`;
            }
          },
          {
            title: '营养价值',
            key: 'nutrition'
          },
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '等级',
            key: 'level'
          },
          {
            title: '父级',
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
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "2-2";
      });
    },
    methods: {
      getData () {
        let param = {
          title: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getClassList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取分类列表失败!');
          }
        });
      },
      remove (index) {
        let param = {
          id: this.data[index].id
        }
        store.delClass(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('删除成功!');
            this.data.splice(index, 1);
          } else {
            this.$Message.error('删除分类失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/class/edit/"+this.data[index].id);
      },
    }
  }
</script>
