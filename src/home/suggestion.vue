<template>
  <Row style="margin: 10px 0">
    <i-input id="search" :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
  </Row>
  <i-table style="margin:20px 0;" border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
</template>
<script>
  import store from '../store/suggestion.js';
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
            title: '设备型号',
            key: 'deviceModel',
            render (row, column, index) {
              return `<strong>${row.deviceModel}</strong>`;
            }
          },
          {
            title: 'userId',
            key: 'userId'
          },
          {
            title: '反馈意见',
            key: 'content',
            render (row, column, index) {
              return `<Tooltip placement="top">${row.content.substr(0,10)+(row.content.length>10?"...":"")}<div slot="content"><p>${row.content}</p></div></Tooltip>`;
            }
          },
          {
            title: '设备名称',
            key: 'deviceName'
          },
          {
            title: '系统类型',
            key: 'systemType'
          },
          {
            title: '系统版本',
            key: 'systemVersion'
          },
          {
            title: '设备Id',
            key: 'deviceId'
          },
          {
            title: '用户上传地点',
            key: 'location',
            render (row, column, index) {
              return `${row.location.longitude + '||' + row.location.latitude}`;
            }
          },
          {
            title: '提交时间',
            key: 'sendTime',
            render (row, column, index) {
              return `${new Date(row.sendTime).toLocaleString().replace(/\//g,"-")}`;
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
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
        _this.$parent.$root.$data.activekey = "10-1";
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
        store.getSuggestionList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取反馈意见列表失败!');
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
        let param = {
          id: this.data[index].id
        }
        store.delSuggestion(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('删除反馈意见成功!');
            this.getData();
          } else {
            this.$Message.error('删除反馈意见失败!');
          }
        });
      }
    }
  }
</script>
