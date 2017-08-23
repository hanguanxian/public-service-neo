<template>
<div class="table">
  <!-- 页面table开始 -->
  <base-table ref="myTable"
        :child-table-columns="tableConfig.columns"
        :child-table-options="tableConfig.tableOptions"
        :child-table-actions="tableConfig.tableActions"
        :child-table-data="tableData"
        @pageChange="pageChanged">
        <!-- 顶部工具栏 -->
        <div slot="topBtns">
            <group-btns :child-btns="topBtnsConfig"></group-btns>
        </div>
  </base-table>
  <!-- 页面table结束 -->
  <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog :visible.sync="dialogVisible" size="small">
    <base-form :child-form-items="dialogForm.items"
               :child-form-options="dialogForm.options"
               :child-form-data="dialogFormData"
               @submitCallBack="dialogCallBack">
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
  data() {
    const self = this;
    return {
      //弹出框配置
      dialogForm: {
        items: [{name: '所属项目',placeholder: '所属项目', key: 'projectId',type: 'select',
        selectOptions:[]}, {
          name: '公告位置标识',
          key: 'positionCode'
        }, {
          name: '公告位置名称',
          key: 'positionName'
        }],
        options: {
          submitUrl: "/interface/announcement/position_list", //新建的链接
          submitRow: true,//提交按钮是否单独占一行
          defaultRules: {
            required: true,
            message: '必填',
            trigger: 'blur'
          }, //表单默认校验规则
          //inline: true, //输入框是否在一行内
          labelWidth: "130px",
          submitName: '确定' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: [{
          name: '所属项目',
          key: 'projectId'
        }, {
          name: '项目名称',
          key: 'projectName'
        }, {
          name: '公告位置标识',
          key: 'positionCode'
        }, {
          name: '公告位置名称',
          key: 'positionName'
        }, {
          name: '是否启用',
          key: 'isEnable'
        }],
        tableActions: {
          name: '操作',
          key: 'actions',
          width: "80",
          fixed: "right",
          buttons: [{
            name: "修改",
            icon: "fa-pencil",
            event(row) {
              console.log(row);
              self.dialogVisible = true;
              self.dialogForm.options.submitUrl = self.updateRowUrl;
              self.dialogForm.items[0].disabled = true;
              self.dialogForm.items[1].disabled = true;
              self.dialogFormData = JSON.parse(JSON.stringify(row));
            }
          }]
        },
        tableOptions: {}
      },
      //表格顶部按钮区域
      topBtnsConfig: [{
          name: "新增",
          event() {
            console.log('新增');
            self.dialogForm.options.submitUrl = self.newRowUrl;
            delete self.dialogForm.items[0].disabled;
            delete self.dialogForm.items[1].disabled;
            self.dialogFormData = {};
            self.dialogVisible = true;
          }
      }],
      dataListUrl: '/interface/announcement/position_list',
      newRowUrl: '/interface/announcement/add_position', //表格全部数据请求地址
      updateRowUrl: "/interface/announcement/edit_position", //更新列表的行链接
      deleteRowUrl: "/interface/announcement/delete_position", //更新列表的行链接
      dialogFormData: {},//弹出框formData
      searchFormData: {},
      selectedTableRows:[],//选中的table 行
      tableData: [],//让搜索框的数据赋值到表格
      msg: '',
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
    self.$axios.post('/interface/banner/project_list').then((res) => {
      var selectOptions = res.data.data;
      var tempArry = [];
      for (var i = 0; i < selectOptions.length; i++) {
        var select = {};
        select.label = selectOptions[i].projectName;
        select.value = selectOptions[i].projectId;
        tempArry.push(select);
      }
      self.dialogForm.items[0].selectOptions = tempArry;
    })
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
          self.$message.success('搜索完成');
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
        this.tableData = res.data.data;
        self.tableConfig.tableOptions.total = res.data.count;
        console.log(self.tableConfig.tableOptions.total);
      })
    },
    dialogCallBack(value) {//弹出框的提交事件
      const self = this;
      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.dialogFormData).then(function(res){
          self.$message.success(res.data.msg);
          self.getTableData();
      }).catch(function (error) {
        console.log(error);
          self.$message.error('失败');
      });
    }
  }
}
</script>
