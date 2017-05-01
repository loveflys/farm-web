<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input id="search" :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
    <i-button span="4" type="info" @click="this.$router.go('/recipes/add')">新建</i-button>
  </Row>

  <i-col class="tabs-style" style="background: #e3e8ee;padding:16px;height: 100vh;">
    <Tabs type="card" :active-key.sync="tabkey">
      <Tab-pane key="all" label="所有">
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
    title="审核食谱"
    closable="false"
    mask-closable="false"
    ok-text="审核通过"
    cancel-text="审核不通过"
    @on-ok="pass"
    @on-cancel="showrefuse">
    <p>标题：</p>{{checkitem.title}}<br />
    <p>作者: </p>{{checkitem.authorName}}<br />
    <p>用料: </p><br />
    <i-table border :content="self" :columns="materialscolumns" :data="checkitem.materials"></i-table>
    <p>做法: </p>{{checkitem.method}}<br />
    <p>图片: </p><br />
    <template v-for="item in checkitem.imgs">
      <img :src="item" style="width: 100px;" /><br />
    </template>
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
  import store from '../store/recipes.js';
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
        status: '-1', // 0 待审核 1 审核通过 2 审核拒绝
        modal: false,
        refusemodal: false,
        reason: '',
        checkitem: null,
        self: this,
        materialscolumns: [
          {
            title: '材料名称',
            key: 'name',
            render (row, column, index) {
              return `<strong>${row.name}</strong>`;
            }
          },
          {
            title: '用料/用量',
            key: 'dosage',
            render (row, column, index) {
              return `${row.dosage}`;
            }
          }
        ],
        columns: [
          {
            title: '标题',
            key: 'title',
            align: 'center',
            render (row, column, index) {
              return `<strong>${row.title}</strong>`;
            }
          },
          {
            title: '作者',
            key: 'authorName',
            align: 'center'
          },
          {
            title: '图片',
            key: 'mainImg',
            align: 'center',
            render (row, column, index) {
              return `<img src="${row.imgs[0]}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render (row, column, index) {
              return `<Tooltip v-if="${row.status==2&&!row.deleted}" placement="top">审核拒绝<div slot="content" v-if="${row.reason && row.reason.length > 0}"><p>${row.reason}</p></div></Tooltip>${row.deleted?"已删除":(row.status==0?"待审核":(row.status==1?"正常":""))}`;
            }
          },
          {
            title: '点击数',
            key: 'viewNum',
            align: 'center'
          },
          {
            title: '收藏数',
            key: 'collectNum',
            align: 'center'
          },
          {
            title: '权重',
            key: 'weight',
            align: 'center'
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
              return `<i-button type="primary" size="small" @click="edit(${index})">编辑</i-button> <i-button v-if="${row.status===0&&!row.deleted}" type="success" size="small" @click="check(${index})">审核</i-button> <i-button v-if="${!row.deleted}" type="error" size="small" @click="remove(${index})">删除</i-button>`;
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
            break;
          case "pass":
            this.status = "1";
            break;
          case "notverify":
            this.status = "0";
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
      let _this = this;
      this.getData();
      this.$nextTick(function () {
        let search = document.getElementById("search");
        search.onkeypress=function(event){
          if(event.which == 13) {
            _this.getData();
          }
        };
        _this.$parent.$root.$data.activekey = "9-1";
      });
    },
    methods: {
      getData () {
        let param = {
          key: this.key,
          status: this.status,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        }
        store.getRecipesList(param, (msg)=> {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取食谱列表失败!');
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
            content: '是否删除该食谱',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
              let param = {
                id: this.data[index].id,
                deleted: 1
              }
              store.updateRecipes(param, (msg)=> {
                if (msg.code === '0') {
                  this.$Message.info('删除食谱成功!');
                  this.getData();
                } else {
                  this.$Message.error('删除食谱失败!');
                }
              });
            },
            onCancel: () => {

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
        store.checkRecipes(param, (msg)=> {
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
        store.checkRecipes(param, (msg)=> {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      edit (index) {
        this.$router.go("/recipes/edit/"+this.data[index].id);
      },
    }
  }
</script>
