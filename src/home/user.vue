<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/user/add')">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
</template>
<script>
  import store from '../store/user.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
        self: this,
        columns: [
          {
            title: '头像',
            key: 'avatar',
            render (row, column, index) {
              return `<img src="${row.avatar}" />`;
            }
          },
          {
            title: '类型',
            key: 'divisionCode',
            render (row, column, index) {
              return `${row.type===1?"用户":"商户"}`;
            }
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
            title: '手机号码',
            key: 'phone'
          }
          ,
          {
            title: 'id',
            key: 'id'
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
        store.getUserList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.users;
          } else {
            this.$Message.error('获取用户列表失败!');
          }
        });
      },
      update (index) {
        let param = {
          id: this.data[index].id,
          disabled: this.data[index].disabled===0?'1':'0'
        }
        let _this = this;
        store.updateUser(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      remove (index) {
        let param = {
          id: this.data[index].id
        }
        store.delUser(param, (msg)=> {
          if (msg.code === '0') {
            this.data.splice(index, 1);
          } else {
            this.$Message.error('删除用户失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/user/edit/"+this.data[index].id);
      }
    }
  }
</script>
