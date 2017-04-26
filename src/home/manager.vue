<style>
  .ivu-page {
    margin-top: 20px;
  }
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/manager/add')">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/manager.js';
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
            title: '头像',
            key: 'avatar',
            render (row, column, index) {
              return `<img src="${row.avatar}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '账户',
            key: 'login'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '真实姓名',
            key: 'realName'
          },
          {
            title: '类型',
            key: 'divisionCode',
            render (row, column, index) {
              return `${row.type===4?"超级管理员":"普通管理员"}`;
            }
          },
          {
            title: '状态',
            key: 'status',
            render (row, column, index) {
              return `${row.isdelete===0?(row.disabled===1?"禁用":"正常"):"已删除"}`;
            }
          },
          {
            title: '手机号码',
            key: 'phone'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button type="${row.disabled===0?'error':'success'}" size="small" @click="update(${index})">${row.disabled===0?"封停":"启用"}</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
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
        this.$parent.$root.$data.activekey = "8-3";
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
        store.getManagerList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.lists;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取管理员列表失败!');
          }
        });
      },
      remove (index) {
        this.$Modal.confirm({
            title: '提示',
            content: '是否删除该管理员',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
              let param = {
                id: this.data[index].id
              }
              store.delManager(param, (msg)=> {
                if (msg.code === '0') {
                  this.$Message.info('删除成功!');
                  this.data.splice(index, 1);
                } else {
                  this.$Message.error('删除管理员失败!');
                }
              });
            },
            onCancel: () => {

            }
        });
      },
      edit (index) {
        this.$router.go("/manager/edit/"+this.data[index].id);
      },
      update (index) {
        let _this = this;
        let param = {
          id: this.data[index].id,
          disabled: this.data[index].disabled===0?'1':'0'
        }
        if (param.disabled == 0) {
          store.updateManager(param, (msg)=> {
            if (msg.code === '0') {
              this.$Message.info('操作成功!', 1, function () {
                _this.getData();
              });
            } else {
              this.$Message.error('操作失败!');
            }
          });
        } else {
          this.$Modal.confirm({
              title: '提示',
              content: '是否禁用该用户',
              okText: '禁用',
              cancelText: '取消',
              onOk: () => {
                store.updateManager(param, (msg)=> {
                  if (msg.code === '0') {
                    this.$Message.info('操作成功!', 1, function () {
                      _this.getData();
                    });
                  } else {
                    this.$Message.error('操作失败!');
                  }
                });
              },
              onCancel: () => {

              }
          });
        }
      },
    }
  }
</script>
