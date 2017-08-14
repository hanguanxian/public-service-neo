<template>
<div class="table">
  <!-- 页面table开始 -->
  <base-table ref="myTable"
        :child-table-columns="tableConfig.columns"
        :child-table-options="tableConfig.tableOptions"
        :child-table-actions="tableConfig.tableActions"
        :child-table-data="tableData"
        @cellClick="cellClickd"
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
        items: [{name: '所属项目',placeholder: '所属项目', key: 'projectName',type: 'select',
        selectOptions:[
            {label: "请选择",value: "-1"},
            {label: "源码国际IOS",value: "yuanma_international_ios"},
            {label: "源码私行IOS",value: "yuanma_domestic_ios"},
            {label: "源码理财师IOS",value: "yuanma_planner_ios"},
            {label: "源码国际Android",value: "yuanma_international_android"},
            {label: "源码私行Android",value: "yuanma_domestic_android"},
            {label: "源码理财师Android",value: "yuanma_planner_android"}
        ]}, {
          name: '公告位置标识',
          key: 'positionCode'
        }, {
          name: '公告位置名称',
          key: 'positionName'
        }],
        options: {
          submitUrl: "/interface/act/add_act_vip_append.do", //新建的链接
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
          width: "300",
          fixed: "right",
          buttons: [{
            name: "修改",
            icon: "fa-pencil",
            event(row) {
              console.log('编辑');
              console.log(row);
              if(row.isOnsale!='否'){
 			      self.$message.error('已上架活动不可以修改');
         	  } else {
                  self.dialogVisible = true;
                  self.dialogForm.options.submitUrl = self.updateRowUrl;
                  self.msg = "修改固收加息活动成功";
                  let copyRow = JSON.stringify(row);
                  self.dialogFormData = JSON.parse(copyRow);
              }
            }
          }]
        },
        tableOptions: {}
      },
      //表格顶部按钮区域
      topBtnsConfig: [{
          name: "新建",
          event() {
            console.log('新建');
            self.dialogForm.options.submitUrl = self.newRowUrl;
            self.msg = "新增固收加息活动成功";
            self.dialogFormData = {};
            self.dialogVisible = true;
          }
      }],
      dataListUrl: '../../../static/position_list.json',
      newRowUrl: '/interface/act/add_act_vip_append.do', //表格全部数据请求地址
      updateRowUrl: "/interface/act/modify_act_vip_append.do", //更新列表的行链接
      onsaleUrl: "/interface/act/modify_act_vip_append_onsale.do",
      deleteRowUrl: "/interface/act/modify_act_vip_append_onsale.do", //更新列表的行链接
      dialogFormData: {},//弹出框formData
      searchFormData: {},
      selectedTableRows:[],//选中的table 行
      tableData: [],//让搜索框的数据赋值到表格
      msg: '',
      tablePage: 1,
      tableRows: 50,
      dialogVisible: false
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
    //   let data = {
    //     "actAutoId":"",
    //     "isOnsale": formData.isOnsale || -1,
    //     "startCreateTime": formData.beginDate || "",
    //     "endCreateTime": formData.endDate || "",
    //     page: self.tablePage,
    //     rows: self.tableRows
    //   }
    //   self.$axios.post(self.searchForm.options.submitUrl, data).then((res) => {
    //       console.log(res);
    //       self.getTableData();
    //   }).catch(function (error) {
    //       self.$message.error('搜索失败');
    //   });
    },
    pageChanged(value) {//翻页的事件
        this.tablePage = value;
        this.getTableData();
    },
    getTableData() {//初始化表格数据
      const self = this;
      self.$axios.get(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
          console.log(res);
        this.tableData = res.data.rows;
      })
    },
    cellClickd(value) {//选中单格的事件
        console.log(value);
        if(value) {
            this.$message(value + '');
        }
    },
    dialogCallBack(value) {//弹出框的提交事件
      console.log('dialogCallBack');
      const self = this;

      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.$qs.stringify(value)).then((res) => {
          self.$message.success(self.msg);
          this.getTableData();
      }).catch(function (error) {
          self.$message.error('失败');
      });
    }
  }
}
</script>
