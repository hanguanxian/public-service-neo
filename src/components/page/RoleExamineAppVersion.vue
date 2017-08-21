<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="searchForm.items"
            :child-form-options="searchForm.options"
            :child-form-data="searchFormData"
            @submitCallBack="searchCallBack">
  </base-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <base-table ref="myTable"
        :child-table-columns="tableConfig.columns"
        :child-table-options="tableConfig.tableOptions"
        :child-table-actions="tableConfig.tableActions"
        :child-table-data="tableData"
        @cellClick="cellClickd"
        @pageChange="pageChanged">
        <!-- 顶部工具栏 -->
  </base-table>
  <!-- 页面table结束 -->

</div>
</template>

<script>
import BaseForm from "../common/BaseForm.vue"
import BaseTable from "../common/BaseTable.vue"
import GroupBtns from "../common/GroupBtns.vue"
export default {
  data() {
    const self = this;
    return {
      //查询框配置
      searchForm: {
        items: [{name: 'APP类型',placeholder: 'APP类型', key: 'appClient',type: 'select',
                selectOptions:[
                    {label: "请选择",value: "-1"},
                    {label: "源码国际IOS",value: "yuanma_international_ios"},
                    {label: "源码私行IOS",value: "yuanma_domestic_ios"},
                    {label: "源码理财师IOS",value: "yuanma_planner_ios"},
                    {label: "源码国际Android",value: "yuanma_international_android"},
                    {label: "源码私行Android",value: "yuanma_domestic_android"},
                    {label: "源码理财师Android",value: "yuanma_planner_android"}
                ]},
                {name: '版本数值',placeholder: '版本数值',key: 'appVersionInt'},
                {name: '版本编码',placeholder: '版本编码', key: 'appVersionStr'},
                {name: '是否强制更新',placeholder: '是否强制更新',key: 'isMust',type: 'select',
                selectOptions: [
                    {label: "请选择",value: "-1"},
                    {label: "是",value: 1},
                    {label: "否",value: 0}
                ]},
            ],
        options: {
          submitUrl: "/interface/sys-app-version/examine_sys_app_version_list", //新建的链接
          submitIcon: "search",//搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: [{
          name: 'ID',
          key: 'appVersionId'
        }, {
          name: 'APP类型',
          key: 'appClient'
        }, {
          name: 'APP类型中文',
          key: 'appClientStr'
        }, {
          name: '版本数值',
          key: 'appVersionInt'
        }, {
          name: '版本编码',
          key: 'appVersionStr'
        }, {
          name: '是否强制更新',
          type: 'boolean',
          boolName: ['是','否'],
          key: 'isMust'
        }, {
          name: '图片地址',
          type: 'href',
          key: 'picUrl'
        }, {
          name: 'app地址',
          type: 'href',
          key: 'appUrl'
        }, {
          name: '版本状态',
          key: 'appVersionState'
        }, {
          name: '版本备注',
          key: 'remark'
        }, {
          name: '创建时间',
          type: "date",
          key: 'createTime'
        }],
        tableActions: {
          name: '操作',
          key: 'actions',
          width: "300",
          fixed: "right",
          buttons: [{
            name: "同意",
            icon: "fa-hand-peace-o",
            event(row) {
              console.log('同意');
              self.$message.success(row);
              self.$axios.post(self.examineUrl, {
                appVersionId: row.appVersionId,
                enumAppVersionState: 200
              }).then((res) => {
                if (res.data.success == true) {
                  self.$message.success('同意');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('系统错误');
              });
            }
          },{
            name: "拒绝",
            icon: "fa-hand-paper-o",
            event(row) {
              console.log('拒绝');
              self.$message.success(row);
              self.$axios.post(self.examineUrl, {
                appVersionId: row.appVersionId,
                enumAppVersionState: 0
              }).then((res) => {
                if (res.data.success == true) {
                  self.$message.success('拒绝');
                  self.getTableData();
                }
              }).catch(function(error) {
                self.$message.error('系统错误');
              });
            }
          }]
        },
        tableOptions: {}
      },
      dataListUrl: '/interface/sys-app-version/examine_sys_app_version_list',
      examineUrl: '/interface/sys-app-version/examine_sys_app_version.do', //表格全部数据请求地址
      searchFormData: {},
      selectedTableRows:[],//选中的table 行
      tableData: [],//让搜索框的数据赋值到表格
      msg: '',
      tablePage: 1,
      tableRows: 50
    }
  },
  components: {
    GroupBtns,
    BaseForm,
    BaseTable //富文本组件
  },
  created() {
      this.getTableData();
  },
  methods: {
    searchCallBack(formData) {//搜索事件
      const self = this;
      console.log(formData);
      formData.page = 1;
      formData.rows = self.tableRows;
      self.$axios.post(self.searchForm.options.submitUrl, formData).then((res) => {
          self.tableData = res.data.data.rows;
      }).catch(function (error) {
          self.$message.error('搜索失败');
      });
    },
    pageChanged(value) {//翻页的事件
        this.tablePage = value;
        this.getTableData();
    },
    getTableData() {//初始化表格数据
      const self = this;
      self.$axios.post(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
        this.tableData = res.data.data.rows;
      })
    },
    cellClickd(value) {//选中单格的事件
        console.log(value);
        if(value) {
            this.$message(value + '');
        }
    }
  }
}
</script>
