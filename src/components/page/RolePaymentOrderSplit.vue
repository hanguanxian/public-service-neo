<template>
    <div>
        <base-table :child-table-columns="baseTableConfig.columns"
                    :child-table-options="baseTableConfig.options"
                    :child-table-actions="baseTableConfig.actions"
                    @selectedRows="getRows">
        </base-table>
    </div>
</template>

<script>
import BaseTable from  "./BaseTable.vue"
    export default {
        data() {
            return {
                baseTableConfig: {
                  columns: [{
                    name: '活动ID',
                    inSearch: true,
                    key: 'actAutoId'
                  }, {
                    name: '活动名称',
                    inDialog: true,
                    inSearch: true,
                    key: 'actName'
                  }, {
                    name: '加息标签',
                    inDialog: true,
                    key: 'appendLable'
                  }, {
                    name: '加息年利率(%)',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'appendYearRate'
                  }, {
                    name: '加息天利率(%)',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'appendDayRate'
                  }, {
                    name: '加息有效天数',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'appendDayCount'
                  }, {
                    name: '有效期开始',
                    inDialog: true,
                    type: "date",
                    rules: { type: 'date', required: true, message: '必填', trigger: 'blur'},
                    key: 'beginDate'
                  }, {
                    name: '有效期截止',
                    inDialog: true,
                    type: "date",
                    rules: { type: 'date', required: true, message: '必填', trigger: 'blur'},
                    key: 'endDate'
                  }, {
                    name: '是否上架',
                    inSearch: true,
                    type: 'select',
                    selectOptions: [{
                      label: "是",
                      value: "1"
                    }, {
                      label: "否",
                      value: "0"
                    }],
                    key: 'isOnsale'
                  }, {
                    name: '产品上限期限',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'termUpperLimit'
                  }, {
                    name: '产品下限期限',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'termLowerLimit'
                  }, {
                    name: '起购金额上限',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'amountUpperLimit'
                  }, {
                    name: '起购金额下限',
                    inDialog: true,
                    rules: { type: 'number', required: true, message: '必填', trigger: 'blur'},
                    key: 'amountLowerLimit'
                  }, {
                    name: '备注',
                    inDialog: true,
                    key: 'remark'
                  }, {
                    name: '创建时间',
                    key: 'createTime'
                  }],
                  options: {
                      stripe: true,
                      dataUrl: '../../../static/act_vip_append_list.json'
                  },
                  actions: {
                    name: '操作',
                    key: 'actions',
                    width: "200",
                    fixed: "right",
                    buttons: [{
                      name: "编辑",
                      event(index, row) {
                          console.log(row);
                          this.dialogForm = row;
                          this.dialogForm.beginDate = new Date(row.beginDate);
                          this.dialogForm.endDate = new Date(row.endDate);
                          this.dialogVisible = true;
                          this.updateBtn = true;
                      }
                    }, {
                      name: "上架",
                      event(index, row) {
                          this.modifyOnsale(row,1);
                      }
                    }, {
                      name: "下架",
                      event(index, row) {
                          this.modifyOnsale(row,0);
                      }
                    }]
                  }
                }
            }
        },
        components: {
          BaseTable
        },
        methods: {
            modifyOnsale(row, onsale) {
                console.log(row);
                return;
              this.$axios.post(this.modifyOnsaleUrl, {
                actAutoId: row.actAutoId,
                onsale: onsale
              }).then((res) => {
                this.getData();
              });
          },
          getRows(val){
              console.log(val);
          }
        }
    }
</script>

<style scoped>
    .drag-box-left{
        float: left;
        width: 45%;
    }
    .drag-box-right{
        float: right;
        width: 45%;
    }
    .drag-list{
        border: 1px solid #ddd;
        padding:20px;
        margin-bottom: 20px;
        transition: border .3s;
    }
    .drag-list:hover{
        border: 1px solid #20a0ff;
    }
    .drag-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
</style>
