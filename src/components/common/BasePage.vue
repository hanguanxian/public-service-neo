<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="searchForm.items" :child-form-options="searchForm.options" :child-form-data="searchFormData" @submitCallBack="searchCallBack">
  </base-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <base-table ref="myTable" :child-table-columns="tableConfig.columns" :child-table-options="tableConfig.tableOptions" :child-table-actions="tableConfig.tableActions" :child-table-data="tableData" @pageChange="pageChanged">
    <!-- 顶部工具栏 -->
    <div slot="topBtns">
      <group-btns :child-btns="topBtnsConfig"></group-btns>
    </div>
  </base-table>
  <!-- 页面table结束 -->
  <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog :visible.sync="dialogVisible" size="small">
    <base-form :child-form-items="dialogForm.items" :child-form-options="dialogForm.options" :child-form-data="dialogFormData" @submitCallBack="dialogCallBack">
    </base-form>
  </el-dialog>
  <!-- 新建 编辑 页面弹出结束 -->
</div>
</template>

<script>
import BaseForm from "../common/BaseForm.vue"
import BaseTable from "../common/BaseTable.vue"
import GroupBtns from "../common/GroupBtns.vue"

export default {
  props: ['searchItems','dialogItems',"tableColumns","tableActionBtns","urlList"],
  data() {
    const self = this;
    return {
      //查询框配置
      searchForm: {
        items: self.searchItems,
        options: {
          submitUrl:  self.urlList.dataListUrl, //新建的链接
          submitIcon: "search", //搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
      //弹出框配置
      dialogForm: {
        items: self.dialogItems,
        options: {
          submitUrl: "", //新建的链接
          submitRow: true, //提交按钮是否单独占一行
          defaultRules: {
            required: true,
            message: '必填',
            trigger: 'blur'
          }, //表单默认校验规则
          labelWidth: "130px",
          submitName: '确定' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: self.tableColumns,
        tableActions: {
          name: '操作',
          key: 'actions',
          fixed: "right",
          buttons: self.tableActionBtns
        },
        tableOptions: {}
      },
      //表格顶部按钮区域
      topBtnsConfig: [{
        name: "新建",
        event() {
          self.dialogForm.options.submitUrl = self.newRowUrl;
          for (var i=0; i<self.dialogForm.items.length; i++) {
            if(self.dialogForm.items[i].disabled) {
              delete self.dialogForm.items[i].disabled;
            }
          }
          self.dialogFormData = {};
          self.dialogVisible = true;
        }
      }],
      dataListUrl: self.urlList.dataListUrl,
      newRowUrl: self.urlList.newRowUrl, //表格全部数据请求地址
      updateRowUrl: self.urlList.updateRowUrl, //更新列表的行链接
      deleteRowUrl: self.urlList.deleteRowUrl, //更新列表的行链接
      dialogFormData: {}, //弹出框formData
      searchFormData: {},
      selectedTableRows: [], //选中的table 行
      tableData: [], //让搜索框的数据赋值到表格
      tablePage: 1,
      tableRows: 25,
      dialogVisible: false
    }
  },
  components: {
    GroupBtns,
    BaseForm,
    BaseTable //富文本组件
  },
  created() {
    const self = this;
    self.getTableData();
  },
  methods: {
    searchCallBack(formData) { //搜索事件
      const self = this;
      formData.isShow = formData.isShow == 1 ? true : false;
      console.log(formData);
      formData.page = 1;
      formData.rows = self.tableRows;
      self.$axios.post(self.searchForm.options.submitUrl, formData).then((res) => {
          self.tableData = res.data.data.rows;
          self.tableConfig.tableOptions.total = res.data.data.count;
          self.$message.success('搜索完成');
      }).catch(function (error) {
          self.$message.error('搜索失败');
      });
    },
    pageChanged(value) { //翻页的事件
      this.tablePage = value;
      this.getTableData();
    },
    getTableData() { //初始化表格数据
      const self = this;
      self.$axios.post(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
        self.tableData = res.data.data.rows;
        self.tableConfig.tableOptions.total = res.data.data.count;
        console.log(self.tableConfig.tableOptions.total);
      })
    },
    dialogCallBack(value) { //弹出框的提交事件
      const self = this;
      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.dialogFormData).then((res) => {
        if(res.data.success || res.data.status) {
          self.$message.success(res.data.msg);
          self.getTableData();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(error) {
        self.$message.error('失败');
      });
    }
  }
}
</script>
