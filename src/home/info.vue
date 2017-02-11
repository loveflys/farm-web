<style>
  .ivu-page {
    margin-top: 20px;
  }
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/info/add')">新建</i-button>
  </Row>


  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
  <Modal
      title="修改点击量"
      :visible.sync="viewmodal"
      @on-ok="changeViewNum"
      class-name="vertical-center-modal">
      <i-input type="number" :value.sync="item.viewNum" placeholder="请输入点击量"></i-input>
  </Modal>
  <Modal
      title="修改权重"
      :visible.sync="weightmodal"
      @on-ok="changeWeight"
      class-name="vertical-center-modal">
      <i-input type="number" :value.sync="item.weight" placeholder="请输入权重"></i-input>
  </Modal>
</template>
<script>
  import store from '../store/info.js';
  import pushStore from '../store/push.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        viewmodal: false,
        weightmodal: false,
        key: '',
        self: this,
        item: null,
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
            key: 'viewNum',
            align: 'center',
            render (row, column, index) {
              return `<span style="margin: 0 10px">${row.viewNum}</span><i-button type="primary" size="small" @click="showViewNum(${index})">修改</i-button>`;
            }
          },
          {
            title: '评论数',
            key: 'commentNum'
          },
          {
            title: '权重',
            key: 'weight',
            align: 'center',
            render (row, column, index) {
              return `<span style="margin: 0 10px">${row.weight}</span><i-button type="primary" size="small" @click="showWeight(${index})">修改</i-button>`;
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
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button type="primary" size="small" @click="push(${index})">推送</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
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
        this.$parent.$root.$data.activekey = "4-1";
      });
    },
    methods: {
      push (index) {
        let _this = this;
        let extra = [{
          extraKey: "id",
          extraValue: this.data[index].id
        }, {
          extraKey: "type",
          extraValue: "info"
        }]
        let param = {
          msg: this.data[index].title,
          title: this.data[index].title,
          msgContent: "测试msgContent",
          extra: JSON.stringify(extra)
        }
        pushStore.push(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('推送成功!');
          } else {
            this.$Message.error('推送失败!');
          }
        });
      },
      getData () {
        let param = {
          title: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getInfoList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
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
      },
      showViewNum (index) {
        this.item = this.data[index];
        this.viewmodal = true;
      },
      showWeight (index) {
        this.item = this.data[index];
        this.weightmodal = true;
      },
      changeViewNum () {
        let param = {
          id: this.item.id,
          view: this.item.viewNum
        }
        let _this = this;
        store.updateInfo(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      changeWeight () {
        let param = {
          id: this.item.id,
          weight: this.item.weight
        }
        let _this = this;
        store.updateInfo(param, (msg)=> {
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
        store.delInfo(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('删除成功!');
            this.data.splice(index, 1);
          } else {
            this.$Message.error('删除信息失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/info/edit/"+this.data[index].id);
      }
    }
  }
</script>
