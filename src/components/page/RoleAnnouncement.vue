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
      // tableConfig 页面展示字段配置
      //   name 页面字段显示的label文字
      //   key  取值的key
      //   insearch 是否在搜索框出现
      //   inDialog 是否在弹出页面显示
      //   type 字段输入时的类型 默认inpute  目前有 date select editor inpute
      //   selectOptions 当type 为select的时候 option的枚举值
      //   tableActions 表格里面的操作按钮以及事件
      //   dialogActions 弹出框里面的操作按钮以及事件
      //   useType 能被2整除 显示在表格 能被3整除显示在表格新建编辑列表页面 能被5整除显示在查询框
      //查询框配置
      searchForm: {
          items: [
                  {name: '公告ID',placeholder: '公告ID',key: 'announcementId'},
                  {name: '所属项目',placeholder: '所属项目', key: 'projectName',type: 'select',
                  selectOptions:[
                      {label: "请选择",value: "-1"},
                      {label: "源码国际IOS",value: "yuanma_international_ios"},
                      {label: "源码私行IOS",value: "yuanma_domestic_ios"},
                      {label: "源码理财师IOS",value: "yuanma_planner_ios"},
                      {label: "源码国际Android",value: "yuanma_international_android"},
                      {label: "源码私行Android",value: "yuanma_domestic_android"},
                      {label: "源码理财师Android",value: "yuanma_planner_android"}
                  ]},
                  {name: '推送位置',placeholder: '推送位置',key: 'positionNames',type: 'select',
                  selectOptions: [
                      {label: "请选择",value: "-1"},
                      {label: "编辑中",value: "0"},
                      {label: "审核中",value: "100"},
                      {label: "正式",value: "200"}
                  ]},
                  {name: '公告标题',placeholder: '公告标题', key: 'announcementName'}
              ],
        options: {
          submitUrl: "/interface/act/act_vip_append_list.do", //新建的链接
          submitIcon: "search",//搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
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
        ]}, {name: '推送位置',placeholder: '推送位置',key: 'positionNames',type: 'select',
        selectOptions: [
            {label: "请选择",value: "-1"},
            {label: "编辑中",value: "0"},
            {label: "审核中",value: "100"},
            {label: "正式",value: "200"}
        ]}, {
          name: '公告标题',
          key: 'announcementName'
        }, {
          name: '公告内容',
          type: 'textarea',
          row: 4,
          key: 'announcementContent'
        }, {
          name: '公告日期',
          type: 'date',
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'announcementDate'
        }, {
          name: '备注',
          type: 'textarea',
          row: 3,
          key: 'remark'
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
          name: '公告ID',
          key: 'announcementId'
        }, {
          name: '所属项目',
          key: 'projectName'
        }, {
          name: '推送位置',
          key: 'positionNames'
        }, {
          name: '公告标题',
          key: 'announcementName'
        }, {
          name: '公告内容',
          key: 'contentShort'
        }, {
          name: '公告日期',
          type: 'date',
          key: 'announcementDate'
        }, {
          name: '是否启用',
          key: 'isEnable'
        }, {
          name: '备注',
          key: 'remark'
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
          },{
            name: "启用",
            icon: "fa-check",
            event(row) {

            }
          }, {
            name: "禁用",
            icon: "fa-close",
            event(row) {

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
      dataListUrl: '../../../static/announcement-list.json',
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
      const self = this;
      self.$axios.get('../../../static/project_list.json').then((res) => {
          var selectOptions = res.data;
          var tempArry = [];
          for (var i = 0; i < selectOptions.length; i++) {
              var select = {};
              select.label = selectOptions[i].projectName;
              select.value = selectOptions[i].projectId;
              tempArry.push(select);
          }
          self.searchForm.items[1].selectOptions = tempArry;
      })
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
        this.tableData = res.data;
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
