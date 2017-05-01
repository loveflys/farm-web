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
    <i-input id="search" :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/info.js';
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
            title: '评论人',
            key: 'userName',
            render (row, column, index) {
              return `${row.userName}`;
            }
          },
          {
            title: '内容',
            key: 'descr',
            render (row, column, index) {
              return `<Tooltip placement="top">${row.content.substr(0,10)+(row.content.length>10?"...":"")}<div slot="content"><p>${row.content}</p></div></Tooltip>`;
            }
          },
          {
            title: '状态',
            key: 'userName',
            render (row, column, index) {
              return `${row.deleted?"已删除":"正常"}`;
            }
          },
          {
            title: '信息id',
            key: 'infoId'
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
              return `<i-button v-if="${!row.deleted}" type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button v-if="${!row.deleted}" type="error" size="small" @click="remove(${index})">删除</i-button>`;
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
      let _this = this;
      this.getData();
      this.$nextTick(function () {
        let search = document.getElementById("search");
        search.onkeypress=function(event){
          if(event.which == 13) {
            _this.getData();
          }
        };
        _this.$parent.$root.$data.activekey = "4-3";
      });
    },
    methods: {
      getData () {
        let param = {
          key: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getInfoCommentList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取信息评论列表失败!');
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
      },
      remove (index) {
        this.$Modal.confirm({
            title: '提示',
            content: '是否删除该评论',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
              let param = {
                id: this.data[index].id,
                deleted: 1
              }
              store.updateInfoCommentList(param, (msg)=> {
                if (msg.code === '0') {
                  this.$Message.info('删除成功!');
                  this.getData();
                } else {
                  this.$Message.error('删除评论失败!');
                }
              });
            },
            onCancel: () => {

            }
        });
      }
    }
  }
</script>
