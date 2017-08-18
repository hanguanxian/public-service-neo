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
               @cancelCallBack="dialogVisible = false"
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
                {name: '版本状态',placeholder: '请选择',key: 'appVersionState',type: 'select',
                selectOptions: [
                    {label: "编辑中",value: "0"},
                    {label: "审核中",value: "100"},
                    {label: "正式",value: "200"}
                ]},
                {name: '是否强制更新',placeholder: '是否强制更新',key: 'isMust',type: 'select',
                selectOptions: [
                    {label: "是",value: 1},
                    {label: "否",value: 0}
                ]},
            ],
        options: {
          submitUrl: "/interface/sys-app-version/sys_app_version_list", //新建的链接
          submitIcon: "search",//搜索按钮
          formClass: 'query-form', //向表单添加样式
          showLabel: false, //是否显示label标签
          inline: true, //输入框是否在一行内
          submitName: '搜索' //提交按钮文字
        }
      },
      //弹出框配置
      dialogForm: {
        items: [{name: 'APP类型',placeholder: 'APP类型', key: 'appClient',type: 'select',
        selectOptions:[
            {label: "请选择",value: "-1"},
            {label: "源码国际IOS",value: "yuanma_international_ios"},
            {label: "源码私行IOS",value: "yuanma_domestic_ios"},
            {label: "源码理财师IOS",value: "yuanma_planner_ios"},
            {label: "源码国际Android",value: "yuanma_international_android"},
            {label: "源码私行Android",value: "yuanma_domestic_android"},
            {label: "源码理财师Android",value: "yuanma_planner_android"}
        ]}, {
          name: '版本数值',
          type: 'number',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'appVersionInt'
        }, {
          name: '版本编码',
          key: 'appVersionStr'
        }, {
          name: '是否强制更新',
          type: 'radio',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          radioOptions: [
              {label: 1, name: '是'},
              {label: 0, name: '否'}
          ],
          key: 'isMust'
        }, {
          name: '图片地址',
          key: 'picUrl'
        }, {
          name: 'app地址',
          key: 'appUrl'
        }, {
          name: '备注',
          type: 'textarea',
          key: 'remark'
        }],
        options: {
          submitUrl: "/interface/sys-app-version/add_act_vip_append.do", //新建的链接
          submitRow: true,//提交按钮是否单独占一行
          cancelBtnShow: true,
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
          type: 'number',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'appVersionInt'
        }, {
          name: '版本编码',
          key: 'appVersionStr'
        }, {
          name: '是否强制更新',
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
          type: 'select',
          selectOptions: [{label: "是",value: "1"}, {label: "否",value: "0"}],
          key: 'appVersionState'
        }, {
          name: '版本备注',
          type: 'richText',
          width: '180px',
          key: 'remark'
        }, {
          name: '创建时间',
          type: "datetime",
          key: 'createTime'
        }],
        tableActions: {
          name: '操作',
          key: 'actions',
          width: "240",
          fixed: "right",
          buttons: [{
            name: "编辑",
            icon: "fa-pencil",
            event(row) {
              console.log('编辑');
              console.log(row);
              self.dialogVisible = true;
              row.isMust = row.isMust ? 1 : 0;
              self.dialogForm.options.submitUrl = self.updateRowUrl;
              self.dialogFormData = JSON.parse(JSON.stringify(row));
            }
          },{
            name: "删除",
            icon: "fa-trash-o",
            event(row) {
                self.$axios.post(self.deleteRowUrl, {
                  appVersionId: row.appVersionId
                }).then((res) => {
                  if (res.data.success == true) {
                    self.$message.success('删除成功');
                    self.getTableData();
                  }
                }).catch(function(error) {
                  self.$message.error('系统错误');
                });
            }
          }, {
            name: "提交审核",
            icon: "fa-clock-o",
            event(row) {
                self.$axios.post("/interface/banner/examine_sys_app_version", {
                  appVersionId: row.appVersionId,
                  enumAppVersionState: row.appVersionState
                }).then((res) => {
                  if (res.data.status == true) {
                    self.$message.success('审核成功');
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
      //表格顶部按钮区域
      topBtnsConfig: [{
          name: "新建",
          event() {
            console.log('新建');
            self.dialogForm.options.submitUrl = self.newRowUrl;
            self.dialogFormData = {};
            self.dialogVisible = true;
          }
      }],
      dataListUrl: '/interface/sys-app-version/sys_app_version_list',
      newRowUrl: '/interface/sys-app-version/add_sys_app_version', //表格全部数据请求地址
      updateRowUrl: "/interface/sys-app-version/modify_sys_app_version", //更新列表的行链接
      deleteRowUrl: "/interface/sys-app-version/remove_sys_app_version", //更新列表的行链接
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
      self.$axios.post(self.dataListUrl, {
        page: self.tablePage,
        rows: self.tableRows,
      }).then((res) => {
        this.tableData = res.data.data.rows;
      })
    },
    dialogCallBack(value) {//弹出框的提交事件
      const self = this;
      self.dialogVisible = false;
      self.$axios.post(self.dialogForm.options.submitUrl, self.dialogFormData).then((res) => {
          this.getTableData();
      }).catch(function (error) {
          self.$message.error('失败');
      });
    }
  }
}
</script>
