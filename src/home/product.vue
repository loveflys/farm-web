<style>
</style>
<template>
  <Row style="margin: 10px 0">
    <i-input :value.sync="key" placeholder="请输入..." style="width: 300px"></i-input>
    <i-button span="4" type="info" @click="getData()">搜索</i-button>
  </Row>
  <i-table border :content="self" :columns="columns" :data="data"></i-table>
  <Page :total="pageCount*pageSize" :page-size="pageSize" :current.sync="pageIndex" show-elevator ></Page>
  <Modal
    title="修改权重"
    @on-ok="changeWeight"
    @on-cancel="cancel"
    :visible.sync="showWeightChange"
    class-name="vertical-center-modal">
    <Input v-model="weight" placeholder="请输入权重"></Input>
  </Modal>
</template>
<script>
  import store from '../store/product.js';
  export default {
    data () {
      return {
        key: '',
        id: '',
        showWeightChange: false,
        weight: 0,
        pageIndex: 1,
        pageSize: 10,
        pageCount: 1,
        self: this,
        columns: [
          {
            title: '产品名称',
            key: 'proName',
            render (row, column, index) {
              return `<strong>${row.proName}</strong>`;
            }
          },
          {
            title: '价格',
            key: 'price',
            render (row, column, index) {
              return `${row.price}`;
            }
          },
          {
            title: '库存',
            key: 'stock'
          },
          {
            title: '主图',
            key: 'mainImg',
            render (row, column, index) {
              return `<img src="${row.imgs[0]}" style="width:100px;height:100px;" />`;
            }
          },
          {
            title: '收藏数',
            key: 'favNum'
          },
          {
            title: '权重',
            key: 'weight',
            render (row, column, index) {
              return `${row.weight}<i-button type="primary" size="small" @click="showChangeWeight(${index})">修改</i-button>`;
            }
          },
          {
            title: '所属市场',
            key: 'marketName'
          },
          {
            title: '所属商户',
            key: 'ownerName'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render (row, column, index) {
              return `<i-button type="${row.is_off_shelve?"primary":"error"}" size="small" @click="update(${index})">${row.is_off_shelve?"上架":"下架"}</i-button>`;
            }
          }
        ],
        data: []
      };
    },
    watch: {
      pageIndex () {
        this.getData();
      }
    },
    ready () {
      window.x = this;
      this.getData();
      this.$nextTick(function () {
        this.$parent.$root.$data.activekey = "2-1";
      });
    },
    methods: {
      getData () {
        let param = {
          proName: this.key,
          pagenum: this.pageIndex,
          pagesize: this.pageSize,
          paged: 1
        };
        store.getProductList(param, (msg) => {
          if (msg.code === '0') {
            this.data = msg.list;
            this.pageCount = msg.totalPage;
          } else {
            this.$Message.error('获取产品列表失败!');
          }
        });
      },
      showChangeWeight (i) {
        this.weight = this.data[i].weight;
        this.id = this.data[i].id;
        this.showWeightChange = true;
      },
      changeWeight () {
        let param = {
          id: this.id,
          weight: this.weight
        };
        let _this = this;
        store.updateProduct(param, (msg) => {
          if (msg.code === '0') {
            this.$Message.info('操作成功!', 1, function () {
              _this.getData();
              _this.showWeightChange = false;
            });
          } else {
            this.$Message.error('操作失败!');
          }
        });
      },
      cancel: function () {
        this.showWeightChange = false;
      },
      update (index) {
        let param = {
          id: this.data[index].id,
          is_off_shelve: this.data[index].is_off_shelve ? '2' : '1'
        };
        let _this = this;

        if (param.is_off_shelve == 2) {
          store.updateProduct(param, (msg) => {
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
              content: '是否下架该商品',
              okText: '下架',
              cancelText: '取消',
              onOk: () => {
                store.updateProduct(param, (msg) => {
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
      getTime (value) {
        if (!value) {
          return '';
        }
        const date = new Date(value);
        const year = date.getFullYear();
        let m = date.getMonth() + 1;
        const month = m < 10 ? '0' + m : m;
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const Hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const Minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const Second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return `${year}-${month}-${day} ${Hour}:${Minute}:${Second}`;
      }
    }
  };
</script>
