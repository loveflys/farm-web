<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
  </Row>
  <i-col class="tabs-style" style="background: #e3e8ee;padding:16px;height: 100vh;">
    <Tabs type="card" :active-key.sync="tabkey">
      <Tab-pane key="all" label="所有">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="top" label="置顶">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="pass" label="已通过">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
      <Tab-pane key="notverify" label="待审核">
        <i-table border :content="self" :columns="columns" :data="data"></i-table>
        <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
      </Tab-pane>
    </Tabs>
  </i-col>
  <Modal
    :visible.sync="modal"
    title="帖子审核"
    closable="false"
    mask-closable="false"
    ok-text="审核通过"
    cancel-text="审核不通过"
    @on-ok="pass"
    @on-cancel="showrefuse">
    <p>标题：</p>{{checkitem.title}}<br />
    <p>作者: </p>{{checkitem.authorName}}<br />
    <p>主图: </p><img :src="checkitem.imgs&&checkitem.imgs.length>0?checkitem.imgs[0]:''" style="width:100px;height:100px;" /><br />
    <p>内容: </p>{{checkitem.content}}<br />
  </Modal>
  <Modal
      title="拒绝理由"
      :visible.sync="refusemodal"
      @on-ok="refuse"
      class-name="vertical-center-modal">
      <i-input type="textarea" :value.sync="reason" placeholder="请输入拒绝理由"></i-input>
  </Modal>
</template>
<script>
  import store from '../store/bbs.js';
  import config from '../utils/config.js';
  import cookie from '../common/cookie.js';
  export default {
    data () {
      return {
        key: '',
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        tabkey: 'all',
        modal: false,
        refusemodal: false,
        reason: '',
        checkitem: null,
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
            title: '作者',
            key: 'authorName'
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
            key: 'status',
            render (row, column, index) {
              return `<Tooltip v-if="${row.status==2}" placement="top">审核拒绝<div slot="content" v-if="${row.reason && row.reason.length > 0}"><p>${row.reason}</p></div></Tooltip>${row.status===0?"待审核":(row.status===1?(row.disabled?"禁用":"审核通过"):"")}`;
            }
          },
          {
            title: '主图',
            key: 'imgs',
            render (row, column, index) {
              return `<img src="${row.imgs&&row.imgs.length>0?row.imgs[0]:''}" style="width:100px;height:100px;" />`;
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
            title: '收藏数',
            key: 'favNum'
          },
          {
            title: '权重',
            key: 'weight'
          },
          {
            title: '是否置顶',
            key: 'isTop',
            render (row, column, index) {
              return `${row.isTop?"是":"否"}`;
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
              return `<i-button v-if="${row.status===1}" type="success" size="small" @click="settop(${index},${row.isTop?2:1})">${row.isTop?"取消置顶":"置顶"}</i-button><i-button v-if="${row.status===0}" type="success" size="small" @click="check(${index})">审核</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
            }
          }
        ],
        data: []
      }
    },
    watch : {
      tabkey () {
        switch(this.tabkey) {
          case "all":
            this.status = "-1";
            this.istop = "-1";
            break;
          case "top":
            this.status = "1";
            this.istop = "1";
            break;
          case "pass":
            this.status = "1";
            this.istop = "-1";
            break;
          case "notverify":
            this.status = "0";
            this.istop = "-1";
            break;
        }
        this.getData();
      },
      pageIndex () {
        this.getData();
      }
    },
    ready() {
      window.x = this;
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "5-1";
      });
    },
    methods: {
      getData () {
        let param = {
          title: this.key,
          istop: this.istop,
          status: this.status,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getBBSList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取论坛帖子列表失败!');
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
          id: this.data[index].id,
          deleted: 1
        }
        store.updateBBS(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('删除帖子成功!');
            this.getData();
          } else {
            this.$Message.error('删除帖子失败!');
          }
        });
      },
      settop (index, istop) {
        let param = {
          id: this.data[index].id,
          istop: istop // 1-设置置顶, 2-取消置顶
        }
        store.updateBBS(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!');
            this.getData();
          } else {
            this.$Message.error('置顶失败!');
          }
        });
      },
      check (index) {
        this.checkitem = this.data[index];
        this.modal = true;
      },
      pass () {
        if (!this.checkitem) {
          return;
        }
        let param = {
          id: this.checkitem.id,
          status: true
        }
        let _this = this;
        store.checkBBS(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      showrefuse () {
        if (!this.checkitem) {
          return;
        }
        this.modal = false;
        this.refusemodal = true;
        this.reason = "";
      },
      refuse () {
        let param = {
          id: this.checkitem.id,
          status: false,
          reason: this.reason
        }
        let _this = this;
        store.checkBBS(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      }
    }
  }
</script>
