<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="searchForm.items"
            :child-form-options="searchForm.options"
            @submitCallBack="searchCallBack">
  </base-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <base-table ref="myTable"
        :child-table-columns="tableConfig.columns"
        :child-table-options="tableConfig.tableOptions"
        :child-table-actions="tableConfig.tableActions"
        :child-table-data="tableData"
        @selectedRows="getRows" @rowDBClick="rowDBClick">
        <!-- 顶部工具栏 -->
        <div slot="topBtns">
            <group-btns :child-btns="topBtnsConfig"></group-btns>
        </div>
  </base-table>
  <!-- 页面table结束 -->
  <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog :visible.sync="dialogVisible" size="large">
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
        items: [{name: '标的ID',placeholder: '标的ID',key: 'actAutoId'},
                {name: '标的名称',placeholder: '标的名称',key: 'actName'},
                {name: '是否上架',placeholder: '是否上架',type: 'select',selectOptions: [{label: "首页热门推广",value: "Bank_Index_Topic"},{label: "首页列表推广",value: "Bank_Index_List"}],key: 'isOnsale'}],
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
        items: [{
          name: '活动名称',
          placeholder: '活动名称',
          key: 'actName'
        }, {
          name: '加息标签',
          key: 'appendLable'
        }, {
          name: '加息年利率(%)',
          type: 'number',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'appendYearRate'
        },{
          name: '加息有效天数',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'appendDayCount'
        }, {
          name: '有效期开始',
          type: "date",
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'beginDate'
        }, {
          name: '有效期截止',
          type: "date",
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'endDate'
        }, {
          name: '产品上限期限',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'termUpperLimit'
        }, {
          name: '产品下限期限',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'termLowerLimit'
        }, {
          name: '起购金额上限',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'amountUpperLimit'
        }, {
          name: '起购金额下限',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'amountLowerLimit'
        }, {
          name: '备注',
          type: 'editor',
          key: 'remark'
        }],
        options: {
          submitUrl: "/interface/act/add_act_vip_append.do", //新建的链接
          submitRow: true,
          defaultRules: {
            required: true,
            message: '必填',
            trigger: 'blur'
          }, //表单默认校验规则
          inline: true, //输入框是否在一行内
          labelWidth: "130px",
          submitName: '确定' //提交按钮文字
        }
      },
      //表格配置
      tableConfig: {
        columns: [{
          name: '标的ID',
          key: 'targetId'
        }, {
          name: '标的名称',
          key: 'targetName'
        }, {
          name: '位置名称',
          key: 'advName'
        }, {
          name: '排序',
          key: 'sort'
        }, {
          name: '标的金额',
          type: 'number',
          rules: {type: 'number',required: true,message: '必填',trigger: 'blur'},
          key: 'targetAmount'
        }, {
          name: '已购买金额',
          key: 'buyAmount'
        }, {
          name: '起息日',
          type: "date",
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'beginDate'
        }, {
          name: '结息日',
          type: "date",
          rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
          key: 'endDate'
        }, {
          name: '状态',
          key: 'state'
        }],
        tableActions: {
          name: '操作',
          key: 'actions',
          width: "100",
          fixed: "right",
          buttons: [{
            name: "编辑",
            icon: "fa-pencil",
            event(row) {
              console.log('移除');
              console.log(row);
              self.dialogVisible = true;
              self.dialogForm.options.submitUrl = self.updateRowUrl;
              self.dialogFormData = row;
            }
          }]
        },
        tableOptions: {
          page: 1,
          rows: 50
        }
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
      newRowUrl: '/interface/act/add_act_vip_append.do', //表格全部数据请求地址
      updateRowUrl: "/interface/act/modify_act_vip_append.do", //更新列表的行链接
      deleteRowUrl: "/interface/act/modify_act_vip_append_onsale.do", //更新列表的行链接
      dataListUrl: '../../../static/regular_adv_list.json',
      dialogFormData: {},//弹出框formData
      selectedTableRows:[],//选中的table 行
      tableData: [],//让搜索框的数据赋值到表格
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
    getRows(value) {
      this.selectedTableRows = value;
      console.log(value);
    },
    searchCallBack(res) {
      console.log('searchCallBack');
      console.log(res);
      let self = this;
      self.$axios.get(self.dataListUrl, {
        page: self.page,
        rows: self.rows,
      }).then((res) => {
          console.log(res.data);
        self.tableData = res.data.rows;
      })
    },
    getTableData() {//初始化表格数据
      let self = this;
      self.$axios.get(self.dataListUrl, {
        page: self.page,
        rows: self.rows,
      }).then((res) => {
        this.tableData = res.data.rows;
      })
    },
    rowDBClick(value) {
        this.$refs.myTable.getData();
        console.log(value);
    },
    dialogCallBack(res) {
      console.log('dialogCallBack');
      this.dialogVisible = false;
      console.log(res);
    }
  }
}
</script>
