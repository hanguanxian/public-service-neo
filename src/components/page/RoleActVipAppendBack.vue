<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <el-form :inline="true" :model="searchForm" ref="searchForm" class="query-form el-form--inline">
    <el-form-item v-for="(item, index) in tablebConfig.columns" v-if="item.inSearch" :key="index">
        <template v-if="item.type == 'date'">
            <el-date-picker type="date" v-model="searchForm[item.key]" style="width: 100%;">
            </el-date-picker>
        </template>
        <template v-else-if="item.type == 'select'">
            <el-select v-model="searchForm[item.key]" clearable placeholder="是否上架">
                <el-option v-for="option in item.selectOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value">
                  </el-option>
            </el-select>
        </template>
        <template v-else>
            <el-input v-model="dialogForm[item.key]"></el-input>
        </template>
    </el-form-item>
    <el-form-item>
      <el-date-picker v-model="searchFormDate" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="search" @click="searchSubmit('searchForm')">查询</el-button>
      <el-button type="primary" icon="plus" @click="dialogVisible = true">新增</el-button>
    </el-form-item>
  </el-form>
  <!-- 搜索区域结束 -->
  <!-- 页面table开始 -->
  <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
    <el-table-column type="selection"></el-table-column> <!-- 勾选框 -->
    <el-table-column v-for="(column, index) in tablebConfig.columns" :key="index" :prop="column.key" :label="column.name" :width="column.width">
    </el-table-column>
    <el-table-column :label="tablebConfig.tableActions.name" :width="tablebConfig.tableActions.width" :fixed="tablebConfig.tableActions.fixed">
        <template scope="scope">
           <el-button v-for="(button, index) in tablebConfig.tableActions.buttons"
                :key="index" size="small"
                @click="button.event(scope.$index, scope.row)">{{ button.name }}</el-button>
        </template>
    </el-table-column>
  </el-table>
  <!-- 分页开始 -->
  <div class="pagination">
    <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
    </el-pagination>
  </div>
  <!-- 分页结束 -->
 <!-- 页面table结束 -->
 <!-- 新建 编辑 页面弹出开始 -->
  <el-dialog title="固收加息活动" :visible.sync="dialogVisible">
    <el-form :model="dialogForm" ref="dialogForm" label-width="120px" style="width:500px; margin: 0 auto;">
      <el-form-item v-for="(item, index) in tablebConfig.columns"
        v-if="item.inDialog" :key="index" :label="item.name" :prop="item.key"
        :rules="item.rules == undefined ? defaultRules : item.rules">
        <template v-if="item.type == 'date'">
              <el-date-picker type="date" v-model="dialogForm[item.key]" style="width: 100%;"></el-date-picker>
        </template>
        <template v-else-if="item.type == 'editor'">
              <quill-editor ref="myTextEditor" v-model="dialogForm[item.key]"></quill-editor>
        </template>
        <template v-else-if="item.type == 'select'">
              <el-select v-model="searchForm[item.key]" clearable placeholder="是否上架">
                  <el-option v-for="option in item.selectOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value">
                    </el-option>
              </el-select>
        </template>
        <template v-else>
              <el-input v-model="dialogForm[item.key]"></el-input>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button v-for="(button, index) in tablebConfig.dialogActions.buttons" :key="index" @click="button.event()">{{ button.name }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 新建 编辑 页面弹出结束 -->
</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';//富文本编辑器
export default {
  data() {
    const self = this;
    return {
        // tablebConfig 页面展示字段配置
        //   name 页面字段显示的label文字
        //   key  取值的key
        //   insearch 是否在搜索框出现
        //   inDialog 是否在弹出页面显示
        //   type 字段输入时的类型 默认inpute  目前有 date select editor inpute
        //   selectOptions 当type 为select的时候 option的枚举值
        //   tableActions 表格里面的操作按钮以及事件
        //   dialogActions 弹出框里面的操作按钮以及事件
      tablebConfig: {
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
        tableActions: {
          name: '操作',
          key: 'actions',
          width: "200",
          fixed: "right",
          buttons: [{
            name: "编辑",
            event(index, row) {
                console.log(row);
                self.dialogForm = row;
                self.dialogForm.beginDate = new Date(row.beginDate);
                self.dialogForm.endDate = new Date(row.endDate);
                self.dialogVisible = true;
                self.updateBtn = true;
            }
          }, {
            name: "上架",
            event(index, row) {
                self.modifyOnsale(row,1);
            }
          }, {
            name: "下架",
            event(index, row) {
                self.modifyOnsale(row,0);
            }
          }]
        },
        dialogActions: {
          buttons: [{
            name: "取消",
            event() {
              self.dialogForm = {};
              self.dialogVisible = false;
              self.updateBtn = false;
            }
          }, {
            name: "确定",
            event() {
              self.dialogSubmit("dialogForm");
            }
          }]
        }
      },
      defaultRules: { required: true, message: '必填', trigger: 'blur'},//表单默认校验规则
      tableData: [],//table显示的表格数据
      multipleSelection: [], //选中的行
      page: 1,//分页的页数
      rows: 50,//分页的行数
      searchFormDate: [], //查询框日期
      updateBtn: false,//共用弹出框的提交按钮 是新数据还是编辑后的数据
      dialogVisible: false, //编辑框是否显示
      searchForm: {
        actAutoId: "",
        startCreateTime: "",
        endCreateTime: "",
        page: 1,
        rows: 50
      },
      dialogForm: {},
      listUrl: '../../../static/act_vip_append_list.json', //列表页面
      searchFormUrl: "/interface/act/act_vip_append_list.do", //搜索的链接
      newFormUrl: "/interface/act/add_act_vip_append.do", //新建的链接
      updateFormUrl: "/interface/act/modify_act_vip_append.do", //更新列表的链接
      modifyOnsaleUrl: "/interface/act/modify_act_vip_append_onsale.do", //上下架的链接
      pickerOptions: {//搜索区域时间快捷键配置
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    this.getData();//进入页面获取数据
  },
  components: {
    quillEditor//富文本组件
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor;
    },
    setEndDate() {
      if (this.dialogForm.endDate === "" || this.dialogForm.endDate < this.dialogForm.beginDate) {
        this.dialogForm.endDate = this.dialogForm.beginDate;
      }
      return this.dialogForm.endDate;
    }
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.dialogForm.mark = html;
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    searchSubmit(formName) {
      this.$axios.post(this.searchFormUrl, this.searchForm).then((res) => {
        self.tableData = res.data;
      });
    },
    dialogSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.updateBtn) { //是否是更新操作
            this.$axios.post(this.updateFormUrl, this.dialogForm).then((res) => {
              this.getData();
            });
          } else {
            this.$axios.post(this.newFormUrl, this.dialogForm).then((res) => {
              this.getData();
            });
          }
        } else {
          this.$message('error submit!!');
          return false;
        }
      });
    },
    getData() {
      let self = this;
      self.$axios.get(self.listUrl, {
        page: self.page,
        rows: self.rows,
      }).then((res) => {
        self.tableData = res.data;
      })
    },
    handleEdit(index, row) {
      this.dialogForm = row;
      this.dialogVisible = true;
      this.updateBtn = true;
    },
    modifyOnsale(row, onsale) {
      this.$axios.post(this.modifyOnsaleUrl, {
        actAutoId: row.actAutoId,
        onsale: onsale
      }).then((res) => {
        this.getData();
      });
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val;
    }
  }
}
</script>
